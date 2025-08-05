import { MigrationInterface, QueryRunner } from "typeorm";

export class VehicleUpdatePricePerkm1750491862066 implements MigrationInterface {
    name = 'VehicleUpdatePricePerkm1750491862066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vechicle" RENAME COLUMN "priceperKm" TO "pricePerKm"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vechicle" RENAME COLUMN "pricePerKm" TO "priceperKm"`);
    }

}
