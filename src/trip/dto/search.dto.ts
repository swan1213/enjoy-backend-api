import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { BookingStatus, PaymentStatus } from "src/common/enum";

export class SearchBookingDto {
@ApiProperty()
   @Type(() => Number) 
@IsNumber(
)
limit:number=10;
@ApiProperty()
@Type(() => Number) 
@IsNumber()
page:number=1


 
}
