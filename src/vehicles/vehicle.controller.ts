import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { VehicleService } from "./vehicle.service";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RouteDto } from "./dto/update-route.dto";


@ApiTags('Vehicle management')
@Controller('vehicles')
export class VehicleController {
    constructor(private readonly vehicleService:VehicleService){}
     @UseGuards(JwtAuthGuard)
      @ApiBearerAuth()
    @Post()
    createVehicle(){
    return this.vehicleService.createVehicle()
    }
    
     @UseGuards(JwtAuthGuard)
      @ApiBearerAuth()
    @Get()
    getVehicles(){
     return this.vehicleService.getVehicles();
    }
     @UseGuards(JwtAuthGuard)
      @ApiBearerAuth() 
    @Patch(':vehicleId/edit')

     manageVehicles(@Body()dto:UpdateVehicleDto, @Param('vehicleId')vehicleId:string){
      return this.vehicleService.manageVehicles(dto, vehicleId)
    }

        @UseGuards(JwtAuthGuard)
      @ApiBearerAuth() 
    @Patch(':routeId/route/edit')
     manageRoute(@Body()dto:RouteDto, @Param('routeId')vehicleId:string){
      return this.vehicleService.manageRoute(dto, vehicleId)
    }
}