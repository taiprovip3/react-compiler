import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1743825236614 implements MigrationInterface {
  name = 'CreateUsersTable1743825236614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`token\` DROP FOREIGN KEY \`FK_e50ca89d635960fda2ffeb17639\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`token\` CHANGE \`user_id\` \`user_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`address\` DROP FOREIGN KEY \`FK_3320d4391aa451ca3c4d9e93141\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`address\` CHANGE \`profile_id\` \`profile_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` DROP FOREIGN KEY \`FK_d752442f45f258a8bdefeebb2f2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` CHANGE \`fullname\` \`fullname\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` CHANGE \`phone_number\` \`phone_number\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` CHANGE \`date_of_birth\` \`date_of_birth\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` CHANGE \`default_address\` \`default_address\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` CHANGE \`user_id\` \`user_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`token\` ADD CONSTRAINT \`FK_e50ca89d635960fda2ffeb17639\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`address\` ADD CONSTRAINT \`FK_3320d4391aa451ca3c4d9e93141\` FOREIGN KEY (\`profile_id\`) REFERENCES \`profile\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` ADD CONSTRAINT \`FK_d752442f45f258a8bdefeebb2f2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`profile\` DROP FOREIGN KEY \`FK_d752442f45f258a8bdefeebb2f2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`address\` DROP FOREIGN KEY \`FK_3320d4391aa451ca3c4d9e93141\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`token\` DROP FOREIGN KEY \`FK_e50ca89d635960fda2ffeb17639\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` CHANGE \`user_id\` \`user_id\` int NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` CHANGE \`default_address\` \`default_address\` text NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` CHANGE \`date_of_birth\` \`date_of_birth\` timestamp NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` CHANGE \`phone_number\` \`phone_number\` varchar(255) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` CHANGE \`fullname\` \`fullname\` varchar(255) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` ADD CONSTRAINT \`FK_d752442f45f258a8bdefeebb2f2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`address\` CHANGE \`profile_id\` \`profile_id\` int NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`address\` ADD CONSTRAINT \`FK_3320d4391aa451ca3c4d9e93141\` FOREIGN KEY (\`profile_id\`) REFERENCES \`profile\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(255) NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`token\` CHANGE \`user_id\` \`user_id\` int NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`token\` ADD CONSTRAINT \`FK_e50ca89d635960fda2ffeb17639\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
