import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateBookings1748870458543 implements MigrationInterface {
    name = 'RecreateBookings1748870458543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "cancellationRequestedAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "cancellationReason" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "cancellationReason" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "cancellationRequestedAt" SET NOT NULL`);
    }

}
