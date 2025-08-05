import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { config } from 'dotenv';
import { User } from './auth/entities/user.entity';
import { PasswordReset } from './auth/entities/password-reset.entity';
import { TripBookingModule } from './trip/trips.module';
import { VehicleModule } from './vehicles/vehicle.module';
import { LegalModule } from './Legal/legal.module';

config();


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'enjoy',
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.ts,.js}'],
        synchronize: false,
        ssl: true,
   
    }),
    AuthModule,
    TripBookingModule,
    VehicleModule, 
    LegalModule
  ],
})
export class AppModule {}