import { MigrationInterface, QueryRunner } from "typeorm";

export class Legal1750499522831 implements MigrationInterface {
    name = 'Legal1750499522831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal" ADD "title" character varying DEFAULT 'Title goes here....'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "legal" DROP COLUMN "title"`);
    }

}
