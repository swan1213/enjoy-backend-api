import { MigrationInterface, QueryRunner } from "typeorm";

export class Vehicle1750107699900 implements MigrationInterface {
    name = 'Vehicle1750107699900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "legal" ("postId" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL DEFAULT 'Lorem ipsum data and ......', CONSTRAINT "PK_0034621ec57c372a3e7a7309d62" PRIMARY KEY ("postId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "legal"`);
    }

}
