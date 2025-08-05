import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateBookings1748555384027 implements MigrationInterface {
    name = 'RecreateBookings1748555384027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying, "birthYear" integer, "isEmailVerified" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_driverlanguage_enum" AS ENUM('fr', 'en', 'es')`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('pending', 'confirmed', 'cancelled', 'completed')`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_paymentstatus_enum" AS ENUM('pending', 'paid', 'failed', 'refunded', 'completed')`);
        await queryRunner.query(`CREATE TYPE "public"."bookings_paymentmethod_enum" AS ENUM('card', 'cash')`);
        await queryRunner.query(`CREATE TABLE "bookings" ("bookingId" uuid NOT NULL DEFAULT uuid_generate_v4(), "departureLocation" character varying NOT NULL, "destinationLocation" character varying NOT NULL, "departureLat" integer NOT NULL DEFAULT '0', "destinationLat" integer NOT NULL DEFAULT '0', "departureLng" integer NOT NULL DEFAULT '0', "destinationLng" integer NOT NULL DEFAULT '0', "distance" integer NOT NULL DEFAULT '0', "refundedAmount" integer NOT NULL DEFAULT '0', "cancellationStatus" character varying NOT NULL DEFAULT 'NONE', "time" integer NOT NULL DEFAULT '0', "tripDateTime" TIMESTAMP WITH TIME ZONE NOT NULL, "passengers" integer NOT NULL, "bags" integer NOT NULL, "childSeat" integer NOT NULL DEFAULT '0', "pets" integer NOT NULL DEFAULT '0', "wheelchair" integer NOT NULL DEFAULT '0', "boosterSeat" integer NOT NULL DEFAULT '0', "driverLanguage" "public"."bookings_driverlanguage_enum" NOT NULL DEFAULT 'fr', "welcomeSign" boolean NOT NULL DEFAULT false, "flightNumber" character varying, "totalPrice" numeric(10,2) NOT NULL, "languageFee" numeric(10,2) NOT NULL DEFAULT '0', "specificLanguage" boolean NOT NULL DEFAULT false, "welcomeSignFee" numeric(10,2) NOT NULL DEFAULT '0', "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'pending', "paymentStatus" "public"."bookings_paymentstatus_enum" NOT NULL DEFAULT 'pending', "paymentMethod" "public"."bookings_paymentmethod_enum", "customerId" character varying NOT NULL, "specialInstructions" character varying, "vehicleType" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cancellationRequestedAt" TIMESTAMP NOT NULL, "cancellationReason" character varying NOT NULL, "customerIdId" uuid, CONSTRAINT "PK_35a5c2c23622676b102ccc3b113" PRIMARY KEY ("bookingId"))`);
        await queryRunner.query(`CREATE TABLE "password_resets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "code" character varying NOT NULL, "userId" uuid NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4816377aa98211c1de34469e742" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_8ce39f3e1331082c10066774112" FOREIGN KEY ("customerIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password_resets" ADD CONSTRAINT "FK_d95569f623f28a0bf034a55099e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_resets" DROP CONSTRAINT "FK_d95569f623f28a0bf034a55099e"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_8ce39f3e1331082c10066774112"`);
        await queryRunner.query(`DROP TABLE "password_resets"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_paymentmethod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_paymentstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_driverlanguage_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
