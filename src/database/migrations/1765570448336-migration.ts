import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1765570448336 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "auth"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "master"`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "core"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS "core" CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "master" CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS "auth" CASCADE`);
  }
}
