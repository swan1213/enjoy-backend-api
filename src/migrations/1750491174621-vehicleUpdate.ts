import { MigrationInterface, QueryRunner } from "typeorm";

export class VehicleUpdate1750491174621 implements MigrationInterface {
    name = 'VehicleUpdate1750491174621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fixed_routes" ("routeId" uuid NOT NULL DEFAULT uuid_generate_v4(), "start" character varying, "destination" character varying, "vehicleTypeId" uuid NOT NULL, CONSTRAINT "PK_da9e610b301f9b2c022b74d89ff" PRIMARY KEY ("routeId"))`);
        await queryRunner.query(`ALTER TABLE "vechicle" ADD "priceperKm" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "vechicle" ALTER COLUMN "price" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "fixed_routes" ADD CONSTRAINT "FK_aee57e8ecb4d9ad1936e6b9988e" FOREIGN KEY ("vehicleTypeId") REFERENCES "vechicle"("vehicleId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fixed_routes" DROP CONSTRAINT "FK_aee57e8ecb4d9ad1936e6b9988e"`);
        await queryRunner.query(`ALTER TABLE "vechicle" ALTER COLUMN "price" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "vechicle" DROP COLUMN "priceperKm"`);
        await queryRunner.query(`DROP TABLE "fixed_routes"`);
    }

}
