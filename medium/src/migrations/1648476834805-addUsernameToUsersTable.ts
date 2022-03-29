import {MigrationInterface, QueryRunner} from "typeorm";

export class addUsernameToUsersTable1648476834805 implements MigrationInterface {
    name = 'addUsernameToUsersTable1648476834805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }

}
