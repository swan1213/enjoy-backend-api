import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import {  Languages, PaymentMethod, VehicleTypes } from 'src/common/enum';



export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  departureLocation: string;

  @ApiProperty()
  @Type(() => Number) 
  @IsNumber()
  departureLat:number
    @ApiProperty()
  @IsString()
  @IsNotEmpty()
  departAddress:string
    @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destinationAddress:string

  @ApiProperty()
  @Type(() => Number) 
  @IsNumber()
   departureLng:number

   @ApiProperty()
   @Type(() => Number) 
  @IsNumber()
  
  destinationLat:number

   @ApiProperty()
   @Type(() => Number) 
  @IsNumber()
  destinationLng:number

  @ApiProperty()
  @IsNumber()
  distance:number

  @ApiProperty()
  @IsNumber()
  time:number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destinationLocation: string;

  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty()
  @IsDateString()
  tripDateTime: Date;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  passengers: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  bags: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  strollers: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  childSeat: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  pets: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  wheelchair: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  boosterSeat?: number;

  @ApiProperty()
  @IsEnum(Languages)
  @IsOptional()
  driverLanguage?: Languages;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  welcomeSign?: boolean=false;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  languageSpecific?: boolean=false;

  @ApiProperty()
  @IsString()
  @IsOptional()
  flightNumber?: string;

  @ApiProperty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  languageFee?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  welcomeSignFee?: number;

  @ApiProperty()
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;
 

  @ApiProperty()
  @IsString()
  @IsOptional()
  specialInstructions?: string;

  @ApiProperty()
  @IsString()
  vehicleType: string;
}
