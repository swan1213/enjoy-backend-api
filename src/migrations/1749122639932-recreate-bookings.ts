import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateBookings1749122639932 implements MigrationInterface {
    name = 'RecreateBookings1749122639932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "customerId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_67b9cd20f987fc6dc70f7cd283f" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_67b9cd20f987fc6dc70f7cd283f"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "customerId"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "customerId" character varying NOT NULL`);
    }

}
