import { MigrationInterface, QueryRunner } from "typeorm";

export class YourMigrationName1749832403577 implements MigrationInterface {
    name = 'YourMigrationName1749832403577'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."bookings_driverlanguage_enum" RENAME TO "bookings_driverlanguage_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_driverlanguage_enum" AS ENUM('fr', 'en', 'es', 'pt', 'ar', 'de', 'it', 'zh')`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "driverLanguage" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "driverLanguage" TYPE "public"."bookings_driverlanguage_enum" USING "driverLanguage"::"text"::"public"."bookings_driverlanguage_enum"`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "driverLanguage" SET DEFAULT 'fr'`);
        await queryRunner.query(`DROP TYPE "public"."bookings_driverlanguage_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."bookings_driverlanguage_enum_old" AS ENUM('fr', 'en', 'es')`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "driverLanguage" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "driverLanguage" TYPE "public"."bookings_driverlanguage_enum_old" USING "driverLanguage"::"text"::"public"."bookings_driverlanguage_enum_old"`);
        await queryRunner.query(`ALTER TABLE "bookings" ALTER COLUMN "driverLanguage" SET DEFAULT 'fr'`);
        await queryRunner.query(`DROP TYPE "public"."bookings_driverlanguage_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."bookings_driverlanguage_enum_old" RENAME TO "bookings_driverlanguage_enum"`);
    }

}
