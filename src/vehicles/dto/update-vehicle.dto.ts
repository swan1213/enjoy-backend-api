import {  ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class UpdateVehicleDto{
    @ApiProperty()
    @IsNumber()
    pricePerKm: number
     @ApiProperty()
    @IsNumber()
    price: number
}
