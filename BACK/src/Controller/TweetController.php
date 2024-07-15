<?php

namespace App\Controller;

use App\Entity\Follow;
use App\Entity\LikeRetweet;
use App\Entity\Tweet;
use App\Entity\User;
use DateTime;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class TweetController extends AbstractController
{
    #[Route('/tweet/post', name: 'app_tweet_post', methods: ['POST'])]
    public function postTweet(Request $request, SerializerInterface $serializer, EntityManagerInterface $em): Response
    {
        $data = $request->getContent();
        $dataArray = json_decode($data, true);
    
        // Vérifier si les hashtags sont fournis et les traiter
        if (isset($dataArray["hashtags"]) && is_array($dataArray["hashtags"])) {
            $hashtags = $dataArray["hashtags"];
            $dataArray["hashtags"] = implode(',', $hashtags);
        } else {
            $dataArray["hashtags"] = '';
        }
    
        if (!isset($dataArray['author']) || !isset($dataArray['content'])) {
            return new JsonResponse(['error' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }
    
        $user = $em->getRepository(User::class)->find($dataArray["author"]);
    
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
    
        if (!is_string($dataArray["content"])) {
            return new JsonResponse(['error' => 'Content must be a string'], Response::HTTP_BAD_REQUEST);
        }
    
        // Nettoyage du contenu du tweet
        $cleanContent = strip_tags($dataArray["content"]); // Supprime les balises HTML
    
        // Vérification et nettoyage de media_url
        if (isset($dataArray["media_url"])) {
            if (!is_string($dataArray["media_url"])) {
                return new JsonResponse(['error' => 'Media URL must be a string'], Response::HTTP_BAD_REQUEST);
            }
    
            $cleanMediaUrl = filter_var($dataArray["media_url"], FILTER_SANITIZE_URL); // Nettoie l'URL
            if (!filter_var($cleanMediaUrl, FILTER_VALIDATE_URL)) {
                return new JsonResponse(['error' => 'Invalid Media URL'], Response::HTTP_BAD_REQUEST);
            }
            $dataArray["media_url"] = $cleanMediaUrl; // Mise à jour de l'URL nettoyée
        }
    
        // Mise à jour du contenu nettoyé dans le tableau de données
        $dataArray["content"] = $cleanContent;
    
        // Désérialiser les données nettoyées
        $tweet = $serializer->deserialize(json_encode($dataArray), Tweet::class, 'json');
        $tweet->setAuthor($user);
    
        // Gérer le fuseau horaire
        $timezone = new DateTimeZone($dataArray['timezone']);
        $tweet->setDate(new DateTime('now', $timezone));
    
        // Gérer le type de tweet (quote)
        if (isset($dataArray["type"]) && ($dataArray["type"] === 'quote' || $dataArray["type"] === 'answer')) {
            if (!isset($dataArray["relatedTweet"])) {
                return new JsonResponse(['error' => 'Related tweet ID is required for quotes'], Response::HTTP_BAD_REQUEST);
            }
    
            $relatedTweet = $em->getRepository(Tweet::class)->find($dataArray["relatedTweet"]);
    
            if (!$relatedTweet) {
                return new JsonResponse(['error' => 'Related tweet not found'], Response::HTTP_NOT_FOUND);
            }
    
            $tweet->setRelatedTweet($relatedTweet); // Assurez-vous que la méthode setRelatedTweet est définie dans votre entité Tweet
        }
    
        $em->persist($tweet);
        $em->flush();
    
        return new JsonResponse([
            'message' => 'Tweet posté avec succès',
            'tweet' => [
                'id' => $tweet->getId(),
                'author' => $tweet->getAuthor(),
                'date' => $tweet->getDate()->format('Y-m-d H:i:s'),
                'content' => $tweet->getContent(),
                'media_url' => $tweet->getMediaUrl(),
                'related_tweet' => $tweet->getRelatedTweet(),
                'type' => $tweet->getType(),
                'likes' => $tweet->getLikesCount(),
                'userLiked' => false,
                'retweets' => $tweet->getRetweetsCount(),
                'userRetweeted' => false,
                "answersCount" => 0,
                "quotesCount" => 0
            ]
        ], Response::HTTP_CREATED);
    }
    

    ///Récupère la TL de l'utilisateur ( Home.js )
    #[Route('/tweet/get_tl', name: 'app_tweet_get_tl_for_you', methods: ['POST'])]
    public function getTlForYou(Request $request, NormalizerInterface $normalizer, EntityManagerInterface $em): JsonResponse
    {
        $data=json_decode($request->getContent(), true);
        $userId = $data["id"];
        $tlType = $data["type"];

        $user = $em->getRepository(User::class)->find($userId);
        $tweetRepository = $em->getRepository(Tweet::class);

        if($tlType === "foryou") {
            $queryBuilder = $tweetRepository->createQueryBuilder('t');
            $queryBuilder->where('t.type != :placeholder OR t.type is NULL')
                         ->setParameter('placeholder', 'placeholder');
            $tweets = $queryBuilder->getQuery()->getResult();
        
        } else {
            $follows = $em->getRepository(Follow::class)->findBy(["follower" => $user]);
        
            $followTweets = [];
            foreach ($follows as $follow) {
                $followedUser = $follow->getFollowedId();
                $tweetsByFollowedUser = $em->getRepository(Tweet::class)->findBy(["author"=> $followedUser]);
                $followTweets = array_merge($followTweets, $tweetsByFollowedUser);
            }
            $tweets = $followTweets;
        }
        


        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $tweetsData = [];

        foreach ($tweets as $tweet) {
            $likeRetweets = $em->getRepository(LikeRetweet::class)->findBy(['tweet' => $tweet]);
            
            $likes = count(array_filter($likeRetweets, function ($likeRt) {
                return $likeRt->getType() === 'like';
            }));
            $retweets = count(array_filter($likeRetweets, function ($likeRt) {
                return $likeRt->getType() === 'retweet';
            }));

            $userLiked = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
                return $likeRt->getType() === 'like' && $likeRt->getAuthor() === $user;
            })) > 0;

            $userRetweeted = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
                return $likeRt->getType() === 'retweet' && $likeRt->getAuthor() === $user;
            })) > 0;

            $answersCount = count($em->getRepository(Tweet::class)->findBy(["type" => "answer" , "relatedTweet" => $tweet]));
            $quotesCount = count($em->getRepository(Tweet::class)->findBy(["type" => "quote" , "relatedTweet" => $tweet]));

            $tweetData = $normalizer->normalize($tweet);
            $tweetData['likes'] = $likes;
            $tweetData['retweets'] = $retweets;
            $tweetData['userLiked'] = $userLiked;
            $tweetData['userRetweeted'] = $userRetweeted;
            $tweetData['answersCount'] = $answersCount;
            $tweetData['quotesCount'] = $quotesCount;
            $tweetData['hashtags'] = $tweet->getHashtags();

            $tweetsData[] = $tweetData;
        }

        return new JsonResponse($tweetsData, Response::HTTP_OK);
    }

    ///Gère le like ou le retweet d'un tweet
    #[Route('/tweet/likeOrRt', name: 'app_tweet_like_or_rt', methods: ['POST'])]
    public function likeOrRt(Request $request, SerializerInterface $serializer, EntityManagerInterface $em): JsonResponse
    {
        $data = $request->getContent();
        $dataArray = json_decode($data, true);

        // Validation des données
        if (!isset($dataArray['tweet_id'], $dataArray['author_id'], $dataArray['type'], $dataArray['action'])) {
            return new JsonResponse(['error' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }

        $tweet = $em->getRepository(Tweet::class)->find($dataArray["tweet_id"]);
        $user = $em->getRepository(User::class)->find($dataArray["author_id"]);

        if (!$tweet || !$user) {
            return new JsonResponse(['error' => 'Tweet or user not found'], Response::HTTP_NOT_FOUND);
        }

        $likeOrRtRepo = $em->getRepository(LikeRetweet::class);

        if ($dataArray['action'] === 'create') {
            $existing = $likeOrRtRepo->findOneBy(['tweet' => $tweet, 'author' => $user, 'type' => $dataArray['type']]);
            if ($existing) {
                return new JsonResponse(['error' => 'Action already exists'], Response::HTTP_CONFLICT);
            }

            $likeOrRt = new LikeRetweet();
            $likeOrRt->setAuthor($user);
            $likeOrRt->setTweet($tweet);
            $likeOrRt->setType($dataArray["type"]);
            $timezone = new DateTimeZone($dataArray['timezone']);
            $likeOrRt->setDate(new DateTime('now', $timezone));

            $em->persist($likeOrRt);
            $em->flush();

            return new JsonResponse(['success' => 'Action created'], Response::HTTP_OK);
        } elseif ($dataArray['action'] === 'delete') {
            $likeOrRt = $likeOrRtRepo->findOneBy(['tweet' => $tweet, 'author' => $user, 'type' => $dataArray['type']]);
            if (!$likeOrRt) {
                return new JsonResponse(['error' => 'Action not found'], Response::HTTP_NOT_FOUND);
            }

            $em->remove($likeOrRt);
            $em->flush();

            return new JsonResponse(['success' => 'Action deleted'], Response::HTTP_OK);
        }

        return new JsonResponse(['error' => 'Invalid action'], Response::HTTP_BAD_REQUEST);
    }


    // #[Route('/tweet/getUserTweets', name: 'app_tweet_get_user_tweets', methods: ['POST'])]
    // public function getUserTweets( Request $request, NormalizerInterface $normalizer, EntityManagerInterface $em): JsonResponse {

    //     $data = json_decode($request->getContent(), true) ;
    //     $userId = $data["id"];

    //     $tweets = $em->getRepository(Tweet::class)->findBy(["author" => $userId]);
    //     $user = $em->getRepository(User::class)->find($userId);

    //     if (!$user) {
    //         return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
    //     }

    //     $tweetsData = [];

    //     foreach ($tweets as $tweet) {
    //         $likeRetweets = $em->getRepository(LikeRetweet::class)->findBy(['tweet' => $tweet]);
            
    //         $likes = count(array_filter($likeRetweets, function ($likeRt) {
    //             return $likeRt->getType() === 'like';
    //         }));
    //         $retweets = count(array_filter($likeRetweets, function ($likeRt) {
    //             return $likeRt->getType() === 'retweet';
    //         }));

    //         $userLiked = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
    //             return $likeRt->getType() === 'like' && $likeRt->getAuthor() === $user;
    //         })) > 0;

    //         $userRetweeted = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
    //             return $likeRt->getType() === 'retweet' && $likeRt->getAuthor() === $user;
    //         })) > 0;

    //         $answersCount = count($em->getRepository(Tweet::class)->findBy(["type" => "answer" , "relatedTweet" => $tweet]));
    //         $quotesCount = count($em->getRepository(Tweet::class)->findBy(["type" => "quote" , "relatedTweet" => $tweet]));

    //         $tweetData = $normalizer->normalize($tweet);
    //         $tweetData['likes'] = $likes;
    //         $tweetData['retweets'] = $retweets;
    //         $tweetData['userLiked'] = $userLiked;
    //         $tweetData['userRetweeted'] = $userRetweeted;
    //         $tweetData['answersCount'] = $answersCount;
    //         $tweetData['quotesCount'] = $quotesCount;
    //         $tweetData['hashtags'] = $tweet->getHashtags();


    //         $tweetsData[] = $tweetData;
    //     }

    //     return new JsonResponse($tweetsData, Response::HTTP_OK);
    // }

    ///Recupère un tweet via son ID
    #[Route('/tweet/find', name: 'app_tweet_find', methods: ['POST'])]
    public function findTweet(Request $request, NormalizerInterface $normalizer, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $tweet = $em->getRepository(Tweet::class)->find($data["tweetId"]);
        $answers = $em->getRepository(Tweet::class)->findBy(["type" => "answer", "relatedTweet" => $data["tweetId"]]);
        $user = $em->getRepository(User::class)->find($data["userId"]);
    
        $response = [];
    
        // Process the main tweet
        $likeRetweets = $em->getRepository(LikeRetweet::class)->findBy(['tweet' => $tweet]);
    
        $likes = count(array_filter($likeRetweets, function ($likeRt) {
            return $likeRt->getType() === 'like';
        }));
        $retweets = count(array_filter($likeRetweets, function ($likeRt) {
            return $likeRt->getType() === 'retweet';
        }));
    
        $userLiked = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
            return $likeRt->getType() === 'like' && $likeRt->getAuthor() === $user;
        })) > 0;
    
        $userRetweeted = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
            return $likeRt->getType() === 'retweet' && $likeRt->getAuthor() === $user;
        })) > 0;

        $answersCount = count($em->getRepository(Tweet::class)->findBy(["type" => "answer" , "relatedTweet" => $tweet]));
        $quotesCount = count($em->getRepository(Tweet::class)->findBy(["type" => "quote" , "relatedTweet" => $tweet]));

        $tweetData = $normalizer->normalize($tweet);
        $tweetData['likes'] = $likes;
        $tweetData['retweets'] = $retweets;
        $tweetData['userLiked'] = $userLiked;
        $tweetData['userRetweeted'] = $userRetweeted;
        $tweetData['answersCount'] = $answersCount;
        $tweetData['quotesCount'] = $quotesCount;
    
        $response["tweet"] = $tweetData;
    
        // Process the answers
        $answersData = [];
        foreach ($answers as $answer) {
            $likeRetweets = $em->getRepository(LikeRetweet::class)->findBy(['tweet' => $answer]);
    
            $likes = count(array_filter($likeRetweets, function ($likeRt) {
                return $likeRt->getType() === 'like';
            }));
            $retweets = count(array_filter($likeRetweets, function ($likeRt) {
                return $likeRt->getType() === 'retweet';
            }));
    
            $userLiked = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
                return $likeRt->getType() === 'like' && $likeRt->getAuthor() === $user;
            })) > 0;
    
            $userRetweeted = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
                return $likeRt->getType() === 'retweet' && $likeRt->getAuthor() === $user;
            })) > 0;
    
            $answersCount = count($em->getRepository(Tweet::class)->findBy(["type" => "answer" , "relatedTweet" => $answer]));
            $quotesCount = count($em->getRepository(Tweet::class)->findBy(["type" => "quote" , "relatedTweet" => $answer]));

            $answerData = $normalizer->normalize($answer);
            $answerData['likes'] = $likes;
            $answerData['retweets'] = $retweets;
            $answerData['userLiked'] = $userLiked;
            $answerData['userRetweeted'] = $userRetweeted;
            $answerData['answersCount'] = $answersCount;
            $answerData['quotesCount'] = $quotesCount;
    
            $answersData[] = $answerData;
        }
    
        $response["answers"] = $answersData;
    
        return new JsonResponse($response, Response::HTTP_OK);
    }
    

    ///Récupère toutes les réponses d'un tweet (Tweetpage.js)
    #[Route('/tweet/find/answers', name: 'app_tweet_find_answers', methods: ['POST'])]
    public function findTweetAnswers( Request $request, NormalizerInterface $normalizer, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $tweetAnswers = $em->getRepository(Tweet::class)->findBy(["type" => "answer" , "related_tweet" => $data["tweetId"]]);
        $user = $em->getRepository(User::class)->find($data["userId"]);

        $tweetsData = [];

        foreach ($tweetAnswers as $tweet) {
            $likeRetweets = $em->getRepository(LikeRetweet::class)->findBy(['tweet' => $tweet]);
            
            $likes = count(array_filter($likeRetweets, function ($likeRt) {
                return $likeRt->getType() === 'like';
            }));
            $retweets = count(array_filter($likeRetweets, function ($likeRt) {
                return $likeRt->getType() === 'retweet';
            }));

            $userLiked = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
                return $likeRt->getType() === 'like' && $likeRt->getAuthor() === $user;
            })) > 0;

            $userRetweeted = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
                return $likeRt->getType() === 'retweet' && $likeRt->getAuthor() === $user;
            })) > 0;

            $answersCount = count($em->getRepository(Tweet::class)->findBy(["type" => "answer" , "relatedTweet" => $tweet]));
            $quotesCount = count($em->getRepository(Tweet::class)->findBy(["type" => "quote" , "relatedTweet" => $tweet]));

            $tweetData = $normalizer->normalize($tweet);
            $tweetData['likes'] = $likes;
            $tweetData['retweets'] = $retweets;
            $tweetData['userLiked'] = $userLiked;
            $tweetData['userRetweeted'] = $userRetweeted;
            $tweetData['answersCount'] = $answersCount;
            $tweetData['quotesCount'] = $quotesCount;

            $tweetsData[] = $tweetData;
        }  

        return new JsonResponse($tweetsData, Response::HTTP_OK);
    }
    ///Récupère les tweets d'un utilisateur selon leur type (Profil.js)
    #[Route('/tweet/find/userTweets', name: 'app_tweet_find_user_profil', methods: ['POST'])]
    public function findUserTweets(Request $request, NormalizerInterface $normalizer, EntityManagerInterface $em): JsonResponse {
    
        $data = json_decode($request->getContent(), true);
    
        if (!isset($data["id"])) {
            return new JsonResponse(["message" => "Pas d'utilisateur trouvé"], Response::HTTP_BAD_REQUEST);
        }
    
        $user = $em->getRepository(User::class)->find($data["id"]);
        if (!$user) {
            return new JsonResponse(["message" => "Utilisateur non trouvé"], Response::HTTP_NOT_FOUND);
        }
    
        $tweets = [];
        if (isset($data["type"])) {
            switch ($data["type"]) {
                case "posts":
                    $queryBuilder = $em->createQueryBuilder();
                    $queryBuilder->select('t')
                        ->from('App\Entity\Tweet', 't')
                        ->where('t.author = :user')
                        ->andWhere($queryBuilder->expr()->orX(
                            $queryBuilder->expr()->isNull('t.type'),
                            $queryBuilder->expr()->neq('t.type', ':placeholder')
                        ))
                        ->setParameter('user', $user)
                        ->setParameter('placeholder', 'placeholder');
    
                    $tweets = $queryBuilder->getQuery()->getResult();
                    $retweets = $em->getRepository(LikeRetweet::class)->findBy(["author" => $user, "type" => "retweet"]);
    
                    foreach ($retweets as $retweet) {
                        $tweets[] = $retweet->getTweet();
                    }
                    break;
    
                case "answers":
                    $tweets = $em->getRepository(Tweet::class)->findBy(["author" => $user, "type" => "answer"]);
                    break;
    
                case "likes":
                    $likes = $em->getRepository(LikeRetweet::class)->findBy(["author" => $user, "type" => "like"]);
                    foreach ($likes as $like) {
                        $tweets[] = $like->getTweet();
                    }
                    break;
    
                case "medias":
                    $queryBuilder = $em->createQueryBuilder();
                    $queryBuilder->select('t')
                        ->from(Tweet::class, 't')
                        ->where('t.author = :author')
                        ->andWhere('t.media_url IS NOT NULL')
                        ->setParameter('author', $user);
                    $tweets = $queryBuilder->getQuery()->getResult();
                    break;
    
                default:
                    break;
            }
        }
    
        // Utiliser un ensemble pour éviter les doublons
        $tweetSet = [];
        foreach ($tweets as $tweet) {
            $tweetSet[$tweet->getId()] = $tweet;
        }
    
        $uniqueTweets = array_values($tweetSet);
    
        $tweetsData = [];
        foreach ($uniqueTweets as $tweet) {
            $likeRetweets = $em->getRepository(LikeRetweet::class)->findBy(['tweet' => $tweet]);
    
            $likes = count(array_filter($likeRetweets, function ($likeRt) {
                return $likeRt->getType() === 'like';
            }));
            $retweets = count(array_filter($likeRetweets, function ($likeRt) {
                return $likeRt->getType() === 'retweet';
            }));
    
            $userLiked = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
                return $likeRt->getType() === 'like' && $likeRt->getAuthor() === $user;
            })) > 0;
    
            $userRetweeted = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
                return $likeRt->getType() === 'retweet' && $likeRt->getAuthor() === $user;
            })) > 0;
    
            $answersCount = count($em->getRepository(Tweet::class)->findBy(["type" => "answer", "relatedTweet" => $tweet]));
            $quotesCount = count($em->getRepository(Tweet::class)->findBy(["type" => "quote", "relatedTweet" => $tweet]));
    
            $tweetData = $normalizer->normalize($tweet);
            $tweetData['likes'] = $likes;
            $tweetData['retweets'] = $retweets;
            $tweetData['userLiked'] = $userLiked;
            $tweetData['userRetweeted'] = $userRetweeted;
            $tweetData['answersCount'] = $answersCount;
            $tweetData['quotesCount'] = $quotesCount;
            $tweetData['hashtags'] = $tweet->getHashtags();
    
            $tweetsData[] = $tweetData;
        }
    
        return new JsonResponse($tweetsData, Response::HTTP_OK);
    }
    

    ///Donne le nombre de nouveaux tweets postés depuis le dernier fetch
    #[Route('/tweet/getNumberOfNewTweets', name: 'app_tweet_get_number_of_new_tweet', methods: ['GET'])]
    public function getNumberNewTweets(EntityManagerInterface $em): JsonResponse {
        $query = $em->createQuery('SELECT COUNT(t.id) FROM App\Entity\Tweet t WHERE t.type != :placeholder');
        $query->setParameter('placeholder', 'placeholder');
        $numberOfNewTweet = $query->getSingleScalarResult();
    
        return new JsonResponse($numberOfNewTweet);
    }
    
    #[Route('/tweet/delete', name: 'app_tweet_delete', methods: ['POST'])]
    public function deleteTweet(Request $request, EntityManagerInterface $em) : JsonResponse {
        $data = json_decode($request->getContent(), true);
        $tweetId = $data["id"];
        
        // Trouver le tweet à supprimer
        $tweet = $em->getRepository(Tweet::class)->find($tweetId);
        if (!$tweet) {
            return new JsonResponse(['error' => 'Tweet not found'], Response::HTTP_NOT_FOUND);
        }
    
        // Trouver le tweet placeholder
        $placeholderTweet = $em->getRepository(Tweet::class)->findOneBy(["type" => "placeholder"]);
        if (!$placeholderTweet) {
            return new JsonResponse(['error' => 'Placeholder tweet not found'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    
        // Trouver les tweets liés (enfants)
        $relatedTweets = $em->getRepository(Tweet::class)->findBy(["relatedTweet" => $tweet]);
    
        // Associer les tweets liés au tweet placeholder ou les supprimer
        foreach ($relatedTweets as $relatedTweet) {
            if($relatedTweet->getType() === "quote") {
                $relatedTweet->setRelatedTweet($placeholderTweet);
            } else {
                $em->remove($relatedTweet);
            }
        }
    
        // Supprimer le tweet
        $em->remove($tweet);
        $em->flush();
    
        return new JsonResponse(['success' => 'Tweet deleted'], Response::HTTP_OK);
    }

    ///Donne les # tendances des dernières 24H
    #[Route('/tweet/trends/get', name: 'app_tweet_get_trends', methods: ['GET'])]
    public function getTrends(EntityManagerInterface $em): JsonResponse {
    $date = new DateTime();
    $date->modify('-24 hours');

    $query = $em->createQuery(
        'SELECT t.hashtags
         FROM App\Entity\Tweet t
         WHERE t.date > :date'
    )->setParameter('date', $date);

    $allHashtags = $query->getResult();

    $hashtagCounts = [];

    // Convertir les chaînes de caractères en tableaux et compter les occurrences de chaque hashtag
    foreach ($allHashtags as $tweet) {
        if (!empty($tweet['hashtags'])) {
            $hashtagsArray = explode(',', $tweet['hashtags']);
            foreach ($hashtagsArray as $hashtag) {
                $hashtag = trim($hashtag); // Supprime les espaces blancs autour du hashtag
                if (!isset($hashtagCounts[$hashtag])) {
                    $hashtagCounts[$hashtag] = 0;
                }
                $hashtagCounts[$hashtag]++;
            }
        }
    }

    // Trier les hashtags par nombre d'occurrences en ordre décroissant
    arsort($hashtagCounts);

    // Préparer la réponse
    $response = [];
    foreach ($hashtagCounts as $hashtag => $count) {
        $response[] = [
            'hashtag' => $hashtag,
            'count' => $count
        ];
    }

    return new JsonResponse($response, Response::HTTP_OK);
    }

    ///Récupère les tweets avec les # tendances
    #[Route('/tweet/get/byTrend', name: 'app_tweet_get_byTrend', methods: ['POST'])]
    public function getTweetsByTrend(Request $request, EntityManagerInterface $em, NormalizerInterface $normalizer): JsonResponse {

    $data = json_decode($request->getContent(), true);

    if (!isset($data['trend'])) {
        return new JsonResponse(['error' => 'Trend not specified'], Response::HTTP_BAD_REQUEST);
    }

    $trend = $data['trend'];
    $query = $em->createQuery(
        'SELECT t
         FROM App\Entity\Tweet t
         WHERE t.hashtags LIKE :trend'
    )->setParameter('trend', '%' . $trend . '%');

    $user = $em->getRepository(User::class)->find($data["user"]);

    $tweets = $query->getResult();

    $tweetsData = [];

    foreach ($tweets as $tweet) {
        $likeRetweets = $em->getRepository(LikeRetweet::class)->findBy(['tweet' => $tweet]);
        
        $likes = count(array_filter($likeRetweets, function ($likeRt) {
            return $likeRt->getType() === 'like';
        }));
        $retweets = count(array_filter($likeRetweets, function ($likeRt) {
            return $likeRt->getType() === 'retweet';
        }));

        $userLiked = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
            return $likeRt->getType() === 'like' && $likeRt->getAuthor() === $user;
        })) > 0;

        $userRetweeted = count(array_filter($likeRetweets, function ($likeRt) use ($user) {
            return $likeRt->getType() === 'retweet' && $likeRt->getAuthor() === $user;
        })) > 0;

        $answersCount = count($em->getRepository(Tweet::class)->findBy(["type" => "answer" , "relatedTweet" => $tweet]));
        $quotesCount = count($em->getRepository(Tweet::class)->findBy(["type" => "quote" , "relatedTweet" => $tweet]));

        $tweetData = $normalizer->normalize($tweet);
        $tweetData['likes'] = $likes;
        $tweetData['retweets'] = $retweets;
        $tweetData['userLiked'] = $userLiked;
        $tweetData['userRetweeted'] = $userRetweeted;
        $tweetData['answersCount'] = $answersCount;
        $tweetData['quotesCount'] = $quotesCount;
        $tweetData['hashtags'] = $tweet->getHashtags();


        $tweetsData[] = $tweetData;
    }

    return new JsonResponse($tweetsData, Response::HTTP_OK);
    }

}
