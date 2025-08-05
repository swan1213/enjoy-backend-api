import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordReset } from './entities/password-reset.entity';
import { User } from './entities/user.entity';
import { JwtStrategy } from './guards/jwt.strategy';
import { EmailModule } from 'src/email/email.module';
import { Booking } from 'src/trip/entities/booking.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordReset, Booking]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}