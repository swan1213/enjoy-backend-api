import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsInt, Min, Max, Matches, IsBoolean } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'Jean', description: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Dupont', description: 'Last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'jean.dupont@gmail.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'SecurePass123!', 
    description: 'Password (minimum 6 characters)',
    minLength: 6 
  })
  @IsString()
  @MinLength(6, { message: '6 caractères minimum' })
  password: string;

  @ApiProperty({ example: '0612345678', description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;


  @ApiProperty({ example: 1990, description: 'Birth year', required: false })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  birthYear?: number;
}
