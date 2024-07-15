<?php

namespace App\Controller;

use App\Entity\Signet;
use App\Entity\Tweet;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SignetController extends AbstractController
{
    #[Route('/signet/create', name: 'app_signet_create')]
    public function create(Request $request , EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $em->getRepository(User::class)->find($data["user"]);
        $tweet = $em->getRepository(Tweet::class)->find($data["tweet"]);

        $signet = new Signet();
        $signet->setUser($user);
        $signet->setTweet($tweet);
        $em->persist($signet);
        $em->flush();

        return new JsonResponse($signet, Response::HTTP_CREATED);
    }

    #[Route('/signet/delete', name: 'app_signet_delete')]
    public function delete(Request $request , EntityManagerInterface $em): JsonResponse
    {
        $signetID = json_decode($request->getContent(), true);
        $signet = $em->getRepository(Signet::class)->find($signetID);
        $em->remove($signet);
        $em->flush();

        return new JsonResponse(['success' => 'Tweet deleted'], Response::HTTP_OK);
    }
}
