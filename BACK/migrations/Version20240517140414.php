<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240517140414 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tweet ADD related_tweet_id INT DEFAULT NULL, ADD type VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE tweet ADD CONSTRAINT FK_3D660A3BB6C2AD36 FOREIGN KEY (related_tweet_id) REFERENCES tweet (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_3D660A3BB6C2AD36 ON tweet (related_tweet_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tweet DROP FOREIGN KEY FK_3D660A3BB6C2AD36');
        $this->addSql('DROP INDEX UNIQ_3D660A3BB6C2AD36 ON tweet');
        $this->addSql('ALTER TABLE tweet DROP related_tweet_id, DROP type');
    }
}
