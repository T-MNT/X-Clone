<?php

namespace App\Entity;

use App\Repository\TweetRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use JsonSerializable;

#[ORM\Entity(repositoryClass: TweetRepository::class)]
class Tweet implements JsonSerializable
{
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->getId(),
            'author' => $this->getAuthor() ? $this->getAuthor() : null,
            'date' => $this->getDate() ? $this->getDate()->format('Y-m-d H:i:s') : null,
            'content' => $this->getContent(),
            'media_url' => $this->getMediaUrl(),
            'related_tweet' => $this->getRelatedTweet(),
            'type' => $this->getType(),
        ];
    }

    public function getLikesCount()
    {
        return count(array_filter($this->likeRetweets->toArray(), function($likeRetweet) {
            return $likeRetweet->getType() === 'like';
        }));
    }

    public function getRetweetsCount()
    {
        return count(array_filter($this->likeRetweets->toArray(), function($likeRetweet) {
            return $likeRetweet->getType() === 'retweet';
        }));
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'tweets')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $author = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(length: 255)]
    private ?string $content = null;

    #[ORM\Column(length: 1200, nullable: true)]
    private ?string $media_url = null;

    /**
     * @var Collection<int, LikeRetweet>
     */
    #[ORM\OneToMany(targetEntity: LikeRetweet::class, mappedBy: 'tweet', orphanRemoval: true)]
    private Collection $likeRetweets;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $type = null;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    private ?self $relatedTweet = null;

    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'relatedTweet')]
    private Collection $children;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $hashtags = null;

    public function __construct()
    {
        $this->likeRetweets = new ArrayCollection();
        $this->children = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

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

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getMediaUrl(): ?string
    {
        return $this->media_url;
    }

    public function setMediaUrl(?string $media_url): static
    {
        $this->media_url = $media_url;

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
            $likeRetweet->setTweet($this);
        }

        return $this;
    }

    public function removeLikeRetweet(LikeRetweet $likeRetweet): static
    {
        if ($this->likeRetweets->removeElement($likeRetweet)) {
            // set the owning side to null (unless already changed)
            if ($likeRetweet->getTweet() === $this) {
                $likeRetweet->setTweet(null);
            }
        }

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getRelatedTweet(): ?self
    {
        return $this->relatedTweet;
    }

    public function setRelatedTweet(?self $relatedTweet): static
    {
        $this->relatedTweet = $relatedTweet;

        return $this;
    }

    /**
     * @return Collection<int, self>
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }

    public function addChild(self $child): static
    {
        if (!$this->children->contains($child)) {
            $this->children->add($child);
            $child->setRelatedTweet($this);
        }

        return $this;
    }

    public function removeChild(self $child): static
    {
        if ($this->children->removeElement($child)) {
            // set the owning side to null (unless already changed)
            if ($child->getRelatedTweet() === $this) {
                $child->setRelatedTweet(null);
            }
        }

        return $this;
    }

    public function getHashtags(): ?string
    {
        return $this->hashtags;
    }

    public function setHashtags(?string $hashtags): static
    {
        $this->hashtags = $hashtags;

        return $this;
    }
}

