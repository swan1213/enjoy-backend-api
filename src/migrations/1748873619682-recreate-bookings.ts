import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateBookings1748873619682 implements MigrationInterface {
    name = 'RecreateBookings1748873619682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" ADD "departAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "destinationAddress" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "destinationAddress"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "departAddress"`);
    }

}
