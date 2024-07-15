<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240519142815 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tweet DROP INDEX UNIQ_3D660A3BB6C2AD36, ADD INDEX IDX_3D660A3BB6C2AD36 (related_tweet_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tweet DROP INDEX IDX_3D660A3BB6C2AD36, ADD UNIQUE INDEX UNIQ_3D660A3BB6C2AD36 (related_tweet_id)');
    }
}
