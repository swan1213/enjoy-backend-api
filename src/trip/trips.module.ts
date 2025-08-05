import { Module } from "@nestjs/common";
import { TripBookingController } from "./trip.controller";
import { BookingService } from "./trip.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Booking } from "./entities/booking.entity";
import { User } from "src/auth/entities/user.entity";

@Module({
    imports:[
     TypeOrmModule.forFeature([Booking, User]),
    ],
    providers:[BookingService],
    controllers:[TripBookingController]
})
export class TripBookingModule {

}