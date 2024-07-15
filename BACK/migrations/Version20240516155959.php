<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240516155959 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE like_retweet (id INT AUTO_INCREMENT NOT NULL, author_id INT NOT NULL, tweet_id INT NOT NULL, type VARCHAR(24) NOT NULL, INDEX IDX_166B3790F675F31B (author_id), INDEX IDX_166B37901041E39B (tweet_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE like_retweet ADD CONSTRAINT FK_166B3790F675F31B FOREIGN KEY (author_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE like_retweet ADD CONSTRAINT FK_166B37901041E39B FOREIGN KEY (tweet_id) REFERENCES tweet (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE like_retweet DROP FOREIGN KEY FK_166B3790F675F31B');
        $this->addSql('ALTER TABLE like_retweet DROP FOREIGN KEY FK_166B37901041E39B');
        $this->addSql('DROP TABLE like_retweet');
    }
}
