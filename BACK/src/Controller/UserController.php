<?php

namespace App\Controller;

use App\Entity\Follow;
use App\Entity\LikeRetweet;
use App\Entity\Signet;
use App\Entity\Tweet;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class UserController extends AbstractController
{
    ///Met à jour le profil du user
    #[Route('/user/updateProfil', name: 'app_user_update_profil')]
    public function updateProfil(Request $request, EntityManagerInterface $em): Response
    {
        $data = json_decode($request->getContent(), true);
        $user = $em->getRepository(User::class)->find($data["id"]);

        if (isset($data["pseudo"]) && is_string($data["pseudo"])) {
            $cleanPseudo = strip_tags($data["pseudo"]); // Supprime les balises HTML
            $cleanPseudo = htmlspecialchars($cleanPseudo, ENT_QUOTES, 'UTF-8'); // Encode les caractères spéciaux
            $user->setPseudo($cleanPseudo);
        }
        
        if (isset($data["bio"]) && is_string($data["bio"])) {
            $cleanBio = strip_tags($data["bio"]);
            $cleanBio = htmlspecialchars($cleanBio, ENT_QUOTES, 'UTF-8');
            $user->setBio($cleanBio);
        }
        
        if (isset($data["website"]) && is_string($data["website"])) {
            $cleanWebsite = strip_tags($data["website"]);
            $cleanWebsite = htmlspecialchars($cleanWebsite, ENT_QUOTES, 'UTF-8');
            $user->setWebsite($cleanWebsite);
        }
        
        if (isset($data["location"]) && is_string($data["location"])) {
            $cleanLocation = strip_tags($data["location"]);
            $cleanLocation = htmlspecialchars($cleanLocation, ENT_QUOTES, 'UTF-8');
            $user->setLocation($cleanLocation);
        }

        if (isset($data["profil_pic"])) {
            if (!is_string($data["profil_pic"])) {
                return new Response(json_encode(['error' => 'Profil pic must be a string'], Response::HTTP_BAD_REQUEST));
            }
    
            $cleanPpUrl = filter_var($data["profil_pic"], FILTER_SANITIZE_URL); // Nettoie l'URL
            if (!filter_var($cleanPpUrl, FILTER_VALIDATE_URL)) {
                return new Response(json_encode(['error' => 'Invalid profile pic URL'], Response::HTTP_BAD_REQUEST));
            }
            $user->setProfilPic($cleanPpUrl); // Mise à jour de l'URL nettoyée
        }
        if (isset($data["cover_pic"])) {
            if (!is_string($data["cover_pic"])) {
                return new Response(json_encode(['error' => 'Cover pic must be a string'], Response::HTTP_BAD_REQUEST));
            }
    
            $cleanCoverUrl = filter_var($data["cover_pic"], FILTER_SANITIZE_URL); // Nettoie l'URL
            if (!filter_var($cleanCoverUrl, FILTER_VALIDATE_URL)) {
                return new Response(json_encode(['error' => 'Invalid cover pic URL'], Response::HTTP_BAD_REQUEST));
            }
            $user->setCoverPic($cleanCoverUrl); // Mise à jour de l'URL nettoyée
        }
        if (isset($data["location"]) && is_string($data["location"])) {
            $cleanLocation = strip_tags($data["location"]);
            $cleanLocation = htmlspecialchars($cleanLocation, ENT_QUOTES, 'UTF-8');
            $user->setLocation($cleanLocation);
        }
        

        // Persist changes to the database
        $em->persist($user);
        $em->flush();

        return new Response(json_encode(['message' => 'User information updated successfully'], Response::HTTP_OK));

    }

    ///Recupère toutes les infos nécessaires d'un user
    #[Route('/user/find', name: 'app_user_find')]
    public function findUser(Request $request, EntityManagerInterface $em, NormalizerInterface $normalizer): Response
    {
        $id = json_decode($request->getContent(), true);
    
        $user = $em->getRepository(User::class)->find($id);
    
        if (!$user) {
            return new Response('User not found', Response::HTTP_NOT_FOUND);
        }

        $signets = $em->getRepository(Signet::class)->findBy(["user" => $user]);

        $signetsData = [];

        foreach ($signets as $signet) {
            $tweet = $signet->getTweet();
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

            $signetsData[] = ["id" => $signet->getId(), "tweet" => $tweetData];
        }
    
        
        $followings = $em->getRepository(Follow::class)->findBy(['follower' => $user]);
        $followers = $em->getRepository(Follow::class)->findBy(['followed' => $user]);

        $filteredFollowers = [];
        foreach ($followers as $follower) {
            $followerData = $follower->jsonSerialize();
            unset($followerData['followed']);
            $followerData['user'] = $followerData['follower'];
            unset($followerData['follower']);
            $filteredFollowers[] = $followerData;
        }
    
        $filteredFollowings = [];
        foreach ($followings as $following) {
            $followingData = $following->jsonSerialize();
            unset($followingData['follower']);
            $followingData['user'] = $followingData['followed'];
            unset($followingData['followed']);
            $filteredFollowings[] = $followingData;
        }
    
        $fullUser = [
            "id" => $user->getId(),
            "bio" => $user->getBio(),
            "birthdate" => $user->getBirthdate(),
            "profil_pic" => $user->getProfilPic(),
            "cover_pic" => $user->getCoverPic(),
            "website" => $user->getWebsite(),
            "location" => $user->getLocation(),
            "username" => $user->getUsername(),
            "pseudo" => $user->getPseudo(),
            "fullname" => $user->getFullname(),
            "roles" => $user->getRoles(),
            "followers" => $filteredFollowers,
            "followings" => $filteredFollowings,
            "signets" => $signetsData
        ];

    
        return new Response(json_encode($fullUser), Response::HTTP_OK, ['Content-Type' => 'application/json']);
    }
    


}
