import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1729609752004 implements MigrationInterface {
    name = 'Default1729609752004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`cpf\` varchar(11) NOT NULL, \`telephone\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`role\` enum ('ADMIN', 'USER') NOT NULL DEFAULT 'USER', UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_230b925048540454c8b4c481e1\` (\`cpf\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`forgot_password\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`token\` varchar(255) NOT NULL, \`isValid\` tinyint NOT NULL DEFAULT 1, \`userId\` int NOT NULL, UNIQUE INDEX \`IDX_d4c574a9c74929c60da5a8c89f\` (\`token\`), UNIQUE INDEX \`REL_dba25590105b78ad1a6adfbc6a\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`forgot_password\` ADD CONSTRAINT \`FK_dba25590105b78ad1a6adfbc6ae\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`forgot_password\` DROP FOREIGN KEY \`FK_dba25590105b78ad1a6adfbc6ae\``);
        await queryRunner.query(`DROP INDEX \`REL_dba25590105b78ad1a6adfbc6a\` ON \`forgot_password\``);
        await queryRunner.query(`DROP INDEX \`IDX_d4c574a9c74929c60da5a8c89f\` ON \`forgot_password\``);
        await queryRunner.query(`DROP TABLE \`forgot_password\``);
        await queryRunner.query(`DROP INDEX \`IDX_230b925048540454c8b4c481e1\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
