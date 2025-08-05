import { MigrationInterface, QueryRunner } from "typeorm";

export class LegalLanguages1750780020476 implements MigrationInterface {
    name = 'LegalLanguages1750780020476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal" ALTER COLUMN "title" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal" ALTER COLUMN "title" SET DEFAULT 'Title goes here....'`);
    }

}
