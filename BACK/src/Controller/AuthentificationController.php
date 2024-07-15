<?php

namespace App\Controller;

use App\Entity\User;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class AuthentificationController extends AbstractController
{
    ///Inscription d'un utilisateur
    #[Route('/register', name: 'app_authentification_register')]
    public function register(Request $request, UserPasswordHasherInterface $passHash, EntityManagerInterface $entityManager, SerializerInterface $serializer): Response
    {
                ///Recuperation et verification de la data///
                $jsonData = $request->getContent();
                $userData = json_decode($jsonData, true);

                $dataValidator = true;


        
                ///Verifie le fullname, mot de passe et email + nettoie les chaines de caractère///
                if(gettype($userData["fullname"]) != "string" || strlen($userData["fullname"]) < 3 || strlen($userData["fullname"]) > 64 ) {
                    $dataValidator = false;
                }
                else {
                    $userData["fullname"] = strip_tags($userData["fullname"]);
                }
                if(gettype($userData["email"]) != "string" || !filter_var($userData["email"], FILTER_VALIDATE_EMAIL)) {
                    $dataValidator = false;
                }
                else {
                    $userData["email"] = strip_tags($userData["email"]);
                }
                if(gettype($userData["password"]) != "string" || strlen($userData["password"]) < 8 || !preg_match('/\d/', $userData["password"]) || !preg_match('/[a-z]/', $userData["password"])) {
                    $dataValidator = false;
                }
                else {
                    $userData["password"] = strip_tags($userData["password"]);
                }
                
                if (!$dataValidator) {
                    return new Response('Données incorrectes', Response::HTTP_UNPROCESSABLE_ENTITY);
                }
                
        
                ///Commence une transaction///
                $entityManager->getConnection()->beginTransaction();
                try {
                    // Deserialize data user + ajoute la date et le role
                    $user = $serializer->deserialize(json_encode($userData), User::class, 'json');
                    $user->setRoles(["ROLE_USER"]);

                    ///On hashe (crypte) le mot de passe de l'utilisateur
                    $hashedPassword = $passHash->hashPassword($user, $user->getPassword());
                    $user->setPassword($hashedPassword);

                    ///On crée un datetime à partir des infos de l'utilisateur
                    $birthdate = DateTime::createFromFormat("d-m-Y", $userData["day"] . "-" . $userData["month"] . "-" . $userData["year"]);
                    $registerDate = new DateTime();
                    $user->setRegisterDate($registerDate);
                
                    $user->setBirthdate($birthdate);
                    $entityManager->persist($user);
                    $entityManager->flush();
        
                    $entityManager->getConnection()->commit();  // Commit the transaction
        
                    return new Response('Création du compte réussie', Response::HTTP_CREATED);
                } 
                catch (\Exception $e) {
                    $entityManager->getConnection()->rollBack();  // Rollback the transaction on error
                    return new Response('Echec de la création du compte ' . $e->getMessage(), Response::HTTP_BAD_REQUEST);
                }
    }

    
}
