import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateBookings1749080208210 implements MigrationInterface {
    name = 'RecreateBookings1749080208210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" ADD "strollers" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "strollers"`);
    }

}
