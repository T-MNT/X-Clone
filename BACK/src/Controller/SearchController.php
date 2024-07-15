<?php

namespace App\Controller;

use App\Entity\LikeRetweet;
use App\Entity\Tweet;
use App\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class SearchController
{
    ///Donne les résultats de la recherche de l'user ( tweets, personnes )
    #[Route('/search', name: 'app_search')]
    public function search(Request $request, EntityManagerInterface $em, NormalizerInterface $norm): JsonResponse    {
        $data = json_decode($request->getContent(), true);



        if (!isset($data["type"]) || !isset($data["search"])) {
            return new Response('Invalid data', Response::HTTP_BAD_REQUEST);
        }

        $type = $data["type"];
        $searchTerm = $data["search"];
        
        $queryBuilder = $em->createQueryBuilder();

        switch ($type) {
            case "trending":
            case "new":
                $queryBuilder->select('t')
                    ->from('App\Entity\Tweet', 't')
                    ->where('t.content LIKE :searchTerm')
                    ->setParameter('searchTerm', '%' . $searchTerm . '%');
                break;
            case "user":
                $queryBuilder->select('u')
                ->from('App\Entity\User', 'u')
                ->where('u.username LIKE :searchTerm')
                ->orWhere('u.pseudo LIKE :searchTerm')
                ->setParameter('searchTerm', '%' . $searchTerm . '%');
            break;
            // Vous pouvez ajouter d'autres cas pour d'autres types de recherche ici
            default:
                return new Response('Invalid search type', Response::HTTP_BAD_REQUEST);
        }

        $query = $queryBuilder->getQuery();
        $fetchedData = $query->getResult();
        $returnedData = [];

        if($type === "trending" || $type === "new" ) {
            $user = $em->getRepository(User::class)->find($data["id"]);
            foreach ($fetchedData as $tweet) {
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
    
                $tweetData = $norm->normalize($tweet);
                $tweetData['likes'] = $likes;
                $tweetData['retweets'] = $retweets;
                $tweetData['userLiked'] = $userLiked;
                $tweetData['userRetweeted'] = $userRetweeted;
                $tweetData['answersCount'] = $answersCount;
                $tweetData['quotesCount'] = $quotesCount;
                $tweetData['hashtags'] = $tweet->getHashtags();
    
                $returnedData[] = $tweetData;
            }
        }

        if($type === "user") {
            $returnedData = $fetchedData;
        }


        return new JsonResponse($returnedData, Response::HTTP_OK);
    }
}

