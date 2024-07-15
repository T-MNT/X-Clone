<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240514163329 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE follow DROP FOREIGN KEY FK_68344470E8DDDA11');
        $this->addSql('ALTER TABLE follow DROP FOREIGN KEY FK_68344470ECD373E5');
        $this->addSql('DROP INDEX IDX_68344470E8DDDA11 ON follow');
        $this->addSql('DROP INDEX IDX_68344470ECD373E5 ON follow');
        $this->addSql('ALTER TABLE follow ADD follower_id INT NOT NULL, ADD followed_id INT NOT NULL, DROP follower_id_id, DROP followed_id_id');
        $this->addSql('ALTER TABLE follow ADD CONSTRAINT FK_68344470AC24F853 FOREIGN KEY (follower_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE follow ADD CONSTRAINT FK_68344470D956F010 FOREIGN KEY (followed_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_68344470AC24F853 ON follow (follower_id)');
        $this->addSql('CREATE INDEX IDX_68344470D956F010 ON follow (followed_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE follow DROP FOREIGN KEY FK_68344470AC24F853');
        $this->addSql('ALTER TABLE follow DROP FOREIGN KEY FK_68344470D956F010');
        $this->addSql('DROP INDEX IDX_68344470AC24F853 ON follow');
        $this->addSql('DROP INDEX IDX_68344470D956F010 ON follow');
        $this->addSql('ALTER TABLE follow ADD follower_id_id INT NOT NULL, ADD followed_id_id INT NOT NULL, DROP follower_id, DROP followed_id');
        $this->addSql('ALTER TABLE follow ADD CONSTRAINT FK_68344470E8DDDA11 FOREIGN KEY (follower_id_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE follow ADD CONSTRAINT FK_68344470ECD373E5 FOREIGN KEY (followed_id_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('CREATE INDEX IDX_68344470E8DDDA11 ON follow (follower_id_id)');
        $this->addSql('CREATE INDEX IDX_68344470ECD373E5 ON follow (followed_id_id)');
    }
}
