import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";


export class RouteDto {
    @ApiProperty()
    @IsNumber()
    price: number
}