<?php

namespace App\Controller;

use App\Entity\Follow;
use App\Entity\User;
use DateTime;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class FollowController extends AbstractController
{
    ///Gère le follow ou l'unfollow d'un user
    #[Route('/follow', name: 'app_follow')]
    public function followHandler(Request $request, EntityManagerInterface $em, SerializerInterface $serializer): JsonResponse   {
        $data = $request->getContent();
        $dataArray = json_decode($data, true);
    
        $followerId = $dataArray["follower"];
        $followedId = $dataArray["followed"];
    
        $follower = $em->getRepository(User::class)->find($followerId);
        $followed = $em->getRepository(User::class)->find($followedId);
    
        if (!$follower || !$followed) {
            return new JsonResponse(['message' => 'Invalid follower or followed user'], Response::HTTP_BAD_REQUEST);
        }
    
        $isFollowExisting = $em->getRepository(Follow::class)->findOneBy([
            "follower" => $follower,
            "followed" => $followed
        ]);
    
        if (is_null($isFollowExisting)) {
            $follow = new Follow();
            $follow->setFollowerId($follower);
            $follow->setFollowedId($followed);
            $follow->setDate(new DateTime());
            $em->persist($follow);
            $em->flush();

            $jsonFollow = ["date" => new Datetime(), "user" => $followed];
    
            return new JsonResponse(['type' => 'create', "follow" => $jsonFollow], Response::HTTP_CREATED);
        } else {
            $em->remove($isFollowExisting);
            $em->flush();
    
            return new JsonResponse(['message' => 'Unfollowed successfully'], Response::HTTP_OK);
        }
    }

    ///Donne les suggestions d'utilisateur à follow
    #[Route('/follow/suggestions', name: 'app_follow_suggestion')]#[Route('/follow/suggestions', name: 'app_follow_suggestion')]
    public function getFollowSuggestions(Request $request, EntityManagerInterface $em, Connection $connection): JsonResponse
    {
        $userID = json_decode($request->getContent(), true);
        $user = $em->getRepository(User::class)->find($userID);
        
        // On récupère tous les abonnements de l'utilisateur
        $followings = $em->getRepository(Follow::class)->findBy(['follower' => $user]);
    
        if (count($followings) > 0) {
            // On récupère tous les abonnements de tous les utilisateurs suivis par l'utilisateur
            $allFollowed = [];
            foreach ($followings as $following) {
                $followedUser = $following->getFollowedId();
                $allFollowed = array_merge($allFollowed, $em->getRepository(Follow::class)->findBy(['follower' => $followedUser]));
            }
    
            // Calculer le nombre de followers pour chaque utilisateur suivi
            $followersCount = [];
            foreach ($allFollowed as $follow) {
                $followedUser = $follow->getFollowedId();
                if ($followedUser->getId() !== $user->getId()) {
                    if (!isset($followersCount[$followedUser->getId()])) {
                        $followersCount[$followedUser->getId()] = [
                            'user' => $followedUser,
                            'count' => 0
                        ];
                    }
                    $followersCount[$followedUser->getId()]['count']++;
                }
            }
    
            // Trier les utilisateurs par nombre de followers en ordre décroissant
            usort($followersCount, function ($a, $b) {
                return $b['count'] - $a['count'];
            });
    
            // Sélectionner les trois premiers utilisateurs
            $topFollowedUsers = array_slice($followersCount, 0, 3);
    
            // Préparer la réponse
            $response = [];
            foreach ($topFollowedUsers as $followedUser) {
                $response[] = [
                    'id' => $followedUser['user']->getId(),
                    'username' => $followedUser['user']->getUsername(),
                    'pseudo' => $followedUser['user']->getPseudo(),
                    'profil_pic' => $followedUser['user']->getProfilPic(),
                    'followers_count' => $followedUser['count']
                ];
            }
    
            return new JsonResponse($response, Response::HTTP_OK);
        } else {
            // Récupérer 3 utilisateurs au hasard en utilisant une requête SQL native
            $sql = 'SELECT id, username, profil_pic, pseudo, bio FROM user WHERE id != :userId ORDER BY RAND() LIMIT 3';
            $stmt = $connection->prepare($sql);
            $stmt->bindValue('userId', $userID);
            $stmt->execute();
            $randomUsers = $stmt->fetchAllAssociative();
    
            return new JsonResponse($randomUsers, Response::HTTP_OK);
        }
    }
    
    
    
}
