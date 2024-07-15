<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface, JsonSerializable
{

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->getId(),
            'pseudo' => $this->getPseudo(),
            'username' => $this->getUsername(),
            'profil_pic' => $this->getProfilPic(),
            'bio' => $this->getBio()
        ];
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    private ?string $fullname = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $birthdate = null;

    #[ORM\Column(length: 64)]
    private ?string $pseudo = null;

    #[ORM\Column(length: 65)]
    private ?string $username = null;

    /**
     * @var Collection<int, Tweet>
     */
    #[ORM\OneToMany(targetEntity: Tweet::class, mappedBy: 'author', orphanRemoval: true)]
    private Collection $tweets;

    /**
     * @var Collection<int, LikeRetweet>
     */
    #[ORM\OneToMany(targetEntity: LikeRetweet::class, mappedBy: 'author', orphanRemoval: true)]
    private Collection $likeRetweets;

    #[ORM\Column(length: 1200, nullable: true)]
    private ?string $profil_pic = null;

    #[ORM\Column(length: 1200, nullable: true)]
    private ?string $cover_pic = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $bio = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $website = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $location = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $register_date = null;

    /**
     * @var Collection<int, Conversation>
     */
    #[ORM\OneToMany(targetEntity: Conversation::class, mappedBy: 'user1')]
    private Collection $conversations;

    /**
     * @var Collection<int, Conversation>
     */
    #[ORM\OneToMany(targetEntity: Conversation::class, mappedBy: 'user2')]
    private Collection $conversationsUser2;

    /**
     * @var Collection<int, Signet>
     */
    #[ORM\OneToMany(targetEntity: Signet::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $signets;

    public function __construct()
    {
        $this->tweets = new ArrayCollection();
        $this->likeRetweets = new ArrayCollection();
        $this->conversations = new ArrayCollection();
        $this->conversationsUser2 = new ArrayCollection();
        $this->signets = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFullname(): ?string
    {
        return $this->fullname;
    }

    public function setFullname(string $fullname): static
    {
        $this->fullname = $fullname;
        return $this;
    }

    public function getBirthdate(): ?\DateTimeInterface
    {
        return $this->birthdate;
    }

    public function setBirthdate(\DateTimeInterface $birthdate): static
    {
        $this->birthdate = $birthdate;
        return $this;
    }

    public function getPseudo(): ?string
    {
        return $this->pseudo;
    }

    public function setPseudo(string $pseudo): static
    {
        $this->pseudo = $pseudo;
        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;
        return $this;
    }

    /**
     * @return Collection<int, Tweet>
     */
    public function getTweets(): Collection
    {
        return $this->tweets;
    }

    public function addTweet(Tweet $tweet): static
    {
        if (!$this->tweets->contains($tweet)) {
            $this->tweets->add($tweet);
            $tweet->setAuthor($this);
        }
        return $this;
    }

    public function removeTweet(Tweet $tweet): static
    {
        if ($this->tweets->removeElement($tweet)) {
            // set the owning side to null (unless already changed)
            if ($tweet->getAuthor() === $this) {
                $tweet->setAuthor(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, LikeRetweet>
     */
    public function getLikeRetweets(): Collection
    {
        return $this->likeRetweets;
    }

    public function addLikeRetweet(LikeRetweet $likeRetweet): static
    {
        if (!$this->likeRetweets->contains($likeRetweet)) {
            $this->likeRetweets->add($likeRetweet);
            $likeRetweet->setAuthor($this);
        }
        return $this;
    }

    public function removeLikeRetweet(LikeRetweet $likeRetweet): static
    {
        if ($this->likeRetweets->removeElement($likeRetweet)) {
            // set the owning side to null (unless already changed)
            if ($likeRetweet->getAuthor() === $this) {
                $likeRetweet->setAuthor(null);
            }
        }
        return $this;
    }

    public function getProfilPic(): ?string
    {
        return $this->profil_pic;
    }

    public function setProfilPic(?string $profil_pic): static
    {
        $this->profil_pic = $profil_pic;
        return $this;
    }

    public function getCoverPic(): ?string
    {
        return $this->cover_pic;
    }

    public function setCoverPic(?string $cover_pic): static
    {
        $this->cover_pic = $cover_pic;
        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): static
    {
        $this->bio = $bio;
        return $this;
    }

    public function getWebsite(): ?string
    {
        return $this->website;
    }

    public function setWebsite(?string $website): static
    {
        $this->website = $website;
        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): static
    {
        $this->location = $location;
        return $this;
    }

    public function getRegisterDate(): ?\DateTimeInterface
    {
        return $this->register_date;
    }

    public function setRegisterDate(\DateTimeInterface $register_date): static
    {
        $this->register_date = $register_date;
        return $this;
    }

    /**
     * @return Collection<int, Conversation>
     */
    public function getConversations(): Collection
    {
        return new ArrayCollection(array_merge($this->conversations->toArray(), $this->conversationsUser2->toArray()));
    }

    public function addConversation(Conversation $conversation): static
    {
        if (!$this->conversations->contains($conversation) && !$this->conversationsUser2->contains($conversation)) {
            if ($conversation->getUser1() === $this) {
                $this->conversations->add($conversation);
                $conversation->setUser1($this);
            } elseif ($conversation->getUser2() === $this) {
                $this->conversationsUser2->add($conversation);
                $conversation->setUser2($this);
            }
        }
        return $this;
    }

    public function removeConversation(Conversation $conversation): static
    {
        if ($this->conversations->removeElement($conversation)) {
            if ($conversation->getUser1() === $this) {
                $conversation->setUser1(null);
            }
        } elseif ($this->conversationsUser2->removeElement($conversation)) {
            if ($conversation->getUser2() === $this) {
                $conversation->setUser2(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, Signet>
     */
    public function getSignets(): Collection
    {
        return $this->signets;
    }

    public function addSignet(Signet $signet): static
    {
        if (!$this->signets->contains($signet)) {
            $this->signets->add($signet);
            $signet->setUser($this);
        }

        return $this;
    }

    public function removeSignet(Signet $signet): static
    {
        if ($this->signets->removeElement($signet)) {
            // set the owning side to null (unless already changed)
            if ($signet->getUser() === $this) {
                $signet->setUser(null);
            }
        }

        return $this;
    }
}
