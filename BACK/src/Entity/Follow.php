<?php

namespace App\Entity;

use App\Repository\FollowRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

#[ORM\Entity(repositoryClass: FollowRepository::class)]
class Follow implements JsonSerializable
{
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->getId(),
            'follower' => $this->getFollowerId(),
            'followed' => $this->getFollowedId(),
            'date' => $this->getDate()->format('Y-m-d H:i:s')
        ];
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $follower = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $followed = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFollowerId(): ?User
    {
        return $this->follower;
    }

    public function setFollowerId(?User $follower): static
    {
        $this->follower = $follower;

        return $this;
    }

    public function getFollowedId(): ?User
    {
        return $this->followed;
    }

    public function setFollowedId(?User $followed): static
    {
        $this->followed = $followed;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }
}
