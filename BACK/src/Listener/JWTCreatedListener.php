<?php

namespace App\Listener;

use App\Entity\Follow;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class JWTCreatedListener
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param JWTCreatedEvent $event
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        // Récupérer l'utilisateur
        $user = $event->getUser();
        if (!$user instanceof UserInterface) {
            return;
        }

        $followings = $this->entityManager->getRepository(Follow::class)->findBy(['follower' => $user]);
        $followers = $this->entityManager->getRepository(Follow::class)->findBy(['followed' => $user]);

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

        // Récupérer les données actuelles du token
        $data = $event->getData();

        // Ajouter des informations supplémentaires
        $data['id'] = $user->getId();
        $data['fullname'] = $user->getFullname();
        $data['birthdate'] = $user->getBirthdate();
        $data['pseudo'] = $user->getPseudo();
        $data['username'] = $user->getUsername();
        $data['bio'] = $user->getBio();
        $data['website'] = $user->getWebsite();
        $data['profil_pic'] = $user->getProfilPic();
        $data['cover_pic'] = $user->getCoverPic();
        $data['location'] = $user->getLocation();
        $data['followers'] = $filteredFollowers;
        $data['followings'] = $filteredFollowings;

        // Mettre à jour les données du token
        $event->setData($data);
    }
}
