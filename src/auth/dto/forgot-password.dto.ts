import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'steve@gmail.com', description: 'Email address' })
  @IsEmail()
  email: string;
}