import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1765570484089 implements MigrationInterface {
    name = 'Migration1765570484089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth"."permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "slug" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_d090ad82a0e97ce764c06c7b312" UNIQUE ("slug"), CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth"."roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "auth"."users_usertype_enum" AS ENUM('admin', 'recruiter', 'candidate')`);
        await queryRunner.query(`CREATE TABLE "auth"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "password" character varying NOT NULL, "userType" "auth"."users_usertype_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "is_verified" boolean NOT NULL DEFAULT false, "role_id" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth"."roles_permissions" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_0cd11f0b35c4d348c6ebb9b36b7" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7d2dad9f14eddeb09c256fea71" ON "auth"."roles_permissions" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_337aa8dba227a1fe6b73998307" ON "auth"."roles_permissions" ("permission_id") `);
        await queryRunner.query(`ALTER TABLE "auth"."users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth"."roles_permissions" ADD CONSTRAINT "FK_7d2dad9f14eddeb09c256fea719" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "auth"."roles_permissions" ADD CONSTRAINT "FK_337aa8dba227a1fe6b73998307b" FOREIGN KEY ("permission_id") REFERENCES "auth"."permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auth"."roles_permissions" DROP CONSTRAINT "FK_337aa8dba227a1fe6b73998307b"`);
        await queryRunner.query(`ALTER TABLE "auth"."roles_permissions" DROP CONSTRAINT "FK_7d2dad9f14eddeb09c256fea719"`);
        await queryRunner.query(`ALTER TABLE "auth"."users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_337aa8dba227a1fe6b73998307"`);
        await queryRunner.query(`DROP INDEX "auth"."IDX_7d2dad9f14eddeb09c256fea71"`);
        await queryRunner.query(`DROP TABLE "auth"."roles_permissions"`);
        await queryRunner.query(`DROP TABLE "auth"."users"`);
        await queryRunner.query(`DROP TYPE "auth"."users_usertype_enum"`);
        await queryRunner.query(`DROP TABLE "auth"."roles"`);
        await queryRunner.query(`DROP TABLE "auth"."permissions"`);
    }

}
