<?php

namespace App\Service;

use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;


class MessagePublisher
{
    private $hub;

    public function __construct(HubInterface $hub)
    {
        $this->hub = $hub;
    }

    public function publish($topic, array $data)
    {
        $update = new Update(
            $topic,
            json_encode($data)
        );

        $this->hub->publish($update);
    }
}
