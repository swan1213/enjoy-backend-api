import { MigrationInterface, QueryRunner } from "typeorm";

export class Vehicle1750102897691 implements MigrationInterface {
    name = 'Vehicle1750102897691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vechicle" ("vehicleId" uuid NOT NULL DEFAULT uuid_generate_v4(), "vehicleType" character varying NOT NULL, "price" double precision NOT NULL, CONSTRAINT "PK_772df1e7d765c433d9f864d1296" PRIMARY KEY ("vehicleId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "vechicle"`);
    }

}
