import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1648460866700 implements MigrationInterface {
  name = 'SeedDb1648460866700';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags(name) VALUES('javascript'), ('nestjs'), ('nodejs')`,
    );
    await queryRunner.query(
      //password is 123
      `INSERT INTO users(username, email, password) VALUES('Adham', 'muzaffarov.adham@gmail.com', '$2b$10$XyK2OqF.LD/wVgbMtjH2Cu2r/YW44adwkXI1Mf/lflH1NG8xKLQq6')`,
    );
  }

  public async down(): Promise<void> {}
}
