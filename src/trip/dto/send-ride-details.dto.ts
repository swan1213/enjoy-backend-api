import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class SendRideDetailsDto  {
    @ApiProperty()
    @IsString()
    message: string 

    @ApiProperty()
    @IsString()
    email:string
    
    @IsOptional()
    @ApiProperty()
    @IsString()
    subject:string
}