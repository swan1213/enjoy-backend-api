import { MigrationInterface, QueryRunner } from "typeorm";

export class VehicleRoutesePrice1750492877983 implements MigrationInterface {
    name = 'VehicleRoutesePrice1750492877983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fixed_routes" ADD "price" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fixed_routes" DROP COLUMN "price"`);
    }

}
