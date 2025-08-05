import { MigrationInterface, QueryRunner } from "typeorm";

export class LegalLanguage1750777186989 implements MigrationInterface {
    name = 'LegalLanguage1750777186989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal" ADD "language" text NOT NULL DEFAULT 'fr'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal" DROP COLUMN "language"`);
    }

}
