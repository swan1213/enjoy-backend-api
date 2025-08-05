import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateBookings1748870052539 implements MigrationInterface {
    name = 'RecreateBookings1748870052539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "departureLat"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "departureLat" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "destinationLat"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "destinationLat" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "departureLng"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "departureLng" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "destinationLng"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "destinationLng" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "distance"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "distance" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "distance"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "distance" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "destinationLng"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "destinationLng" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "departureLng"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "departureLng" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "destinationLat"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "destinationLat" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "departureLat"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "departureLat" integer NOT NULL DEFAULT '0'`);
    }

}
