import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'uuid-token-here', description: 'Reset token from email' })
  @IsUUID()
  token: string;

  @ApiProperty({ example: '123456', description: '6-digit verification code' })
  @IsString()
  code: string;

  @ApiProperty({ 
    example: 'NewSecurePass123!', 
    description: 'New password (minimum 6 characters)',
    minLength: 6 
  })
  @IsString()
  @MinLength(6, { message: '6 caractères minimum' })
  newPassword: string;
}