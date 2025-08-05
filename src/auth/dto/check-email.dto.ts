import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class CheckEmailDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email to check' })
  @IsEmail()
   @Transform(({ value }) => value.toLowerCase())
  email: string;
}