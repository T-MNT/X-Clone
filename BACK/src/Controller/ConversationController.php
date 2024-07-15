<?php

namespace App\Controller;

use App\Entity\Message;
use App\Service\MessagePublisher;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use App\Entity\Conversation;
use DateTime;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\SerializerInterface;

class ConversationController extends AbstractController
{
    #[Route('/conversation/create', name: 'app_conversation_create')]
    public function createConv(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user1 = $em->getRepository(User::class)->find($data["user1"]);
        $user2 = $em->getRepository(User::class)->find($data["user2"]);

        $conv = new Conversation();
        $conv->setUser1($user1);
        $conv->setUser2($user2);
        $conv->setDate(new Datetime());

        $em->persist($conv);
        $em->flush();

        return new JsonResponse($conv, Response::HTTP_OK);
    }

    ///Recupere la liste des conversations d'un utilisateur
    #[Route('/conversation/get', name: 'app_conversation_get')]
    public function getConversation(Request $request, EntityManagerInterface $em, NormalizerInterface $normalizer) : JsonResponse {

        $id = json_decode($request->getContent(), true);
        $user = $em->getRepository(User::class)->find($id);
        $queryBuilder = $em->createQueryBuilder();

        $queryBuilder->select('c')
        ->from('App\Entity\Conversation', 'c')
        ->where('c.user1 = :user OR c.user2 = :user')
        ->setParameter('user', $user);

        $query = $queryBuilder->getQuery();
        $conversations = $query->getResult();

        $conversationsData = [];

        foreach ($conversations as $conv) {
            $messages = $em->getRepository(Message::class)->findBy(["conversation" => $conv]); 
            $convData = $normalizer->normalize($conv);
            $convData["messages"] = $messages;
            $conversationsData[] = $convData;
        }

        return new JsonResponse($conversationsData, Response::HTTP_OK);
    }

    ///Recupere les messages d'une conversation
    #[Route('/conversation/get/messages', name: 'app_conversation_get_messages')]
    public function getConvMessages(Request $request, EntityManagerInterface $em) : JsonResponse {

        $data = json_decode($request->getContent(), true);
        $conv = $em->getRepository(Conversation::class)->find($data["id"]);
        $messages = $em->getRepository(Message::class)->findBy(["conversation" => $conv]);

        return new JsonResponse($messages, Response::HTTP_OK);
    }
    
    ///Gère l'envoi d'un message 
    #[Route('/conversation/post/message', name: 'app_conversation_post_message')]
    public function postConvMessage(Request $request, EntityManagerInterface $em, SerializerInterface $serializer, MessagePublisher $mp) : JsonResponse {

        $data = json_decode($request->getContent(), true);
        $conv = $em->getRepository(Conversation::class)->find($data["convId"]);
        $author = $em->getRepository(User::class)->find($data["authorId"]);

        $message = $serializer->deserialize(json_encode($data), Message::class, 'json');
        $message->setDate(new DateTime());
        $message->setConversation($conv);
        $message->setAuthor($author);

        $em->persist($message);
        $em->flush();

        return new JsonResponse($message, Response::HTTP_CREATED);
    }
    
}
