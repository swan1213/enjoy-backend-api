import { Module } from "@nestjs/common";
import { VehicleService } from "./vehicle.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VehicleEntity } from "./entity/vehicle.entity";
import { VehicleController } from "./vehicle.controller";
import { FixedRoutes } from "./entity/routes.entity";


@Module({
    imports:[
        TypeOrmModule.forFeature([VehicleEntity, FixedRoutes])
    ],
    providers:[VehicleService],
    controllers:[VehicleController]
})

export class VehicleModule {

}