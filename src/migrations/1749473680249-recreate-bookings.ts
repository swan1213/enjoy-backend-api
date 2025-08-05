import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateBookings1749473680249 implements MigrationInterface {
    name = 'RecreateBookings1749473680249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
    }

}
