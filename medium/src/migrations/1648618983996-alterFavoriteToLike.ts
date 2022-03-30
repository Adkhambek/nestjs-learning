import {MigrationInterface, QueryRunner} from "typeorm";

export class alterFavoriteToLike1648618983996 implements MigrationInterface {
    name = 'alterFavoriteToLike1648618983996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_likes_articles" ("usersId" integer NOT NULL, "articlesId" integer NOT NULL, CONSTRAINT "PK_4c375759991bf043c0524242f6a" PRIMARY KEY ("usersId", "articlesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fd397fe5125e6b0aae8175b989" ON "users_likes_articles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0358bd6e0a0ef347915562747f" ON "users_likes_articles" ("articlesId") `);
        await queryRunner.query(`ALTER TABLE "users_likes_articles" ADD CONSTRAINT "FK_fd397fe5125e6b0aae8175b9893" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_likes_articles" ADD CONSTRAINT "FK_0358bd6e0a0ef347915562747f3" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_likes_articles" DROP CONSTRAINT "FK_0358bd6e0a0ef347915562747f3"`);
        await queryRunner.query(`ALTER TABLE "users_likes_articles" DROP CONSTRAINT "FK_fd397fe5125e6b0aae8175b9893"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0358bd6e0a0ef347915562747f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd397fe5125e6b0aae8175b989"`);
        await queryRunner.query(`DROP TABLE "users_likes_articles"`);
    }

}
