import { MigrationInterface, QueryRunner } from "typeorm";

export class LegaTitle1750690441728 implements MigrationInterface {
    name = 'LegaTitle1750690441728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal" ADD "pageTitle" character varying DEFAULT 'Policy Page'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal" DROP COLUMN "pageTitle"`);
    }

}
