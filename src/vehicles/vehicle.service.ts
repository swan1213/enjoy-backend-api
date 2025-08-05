import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VehicleEntity } from "./entity/vehicle.entity";
import { Repository } from "typeorm";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { RouteDto } from "./dto/update-route.dto";
import { FixedRoutes } from "./entity/routes.entity";


@Injectable()
export class VehicleService {
    constructor(
        @InjectRepository(VehicleEntity)
        private readonly vehicleRepository: Repository<VehicleEntity>,
                @InjectRepository(FixedRoutes)
        private readonly fixedRouteRepository: Repository<FixedRoutes>,
    ){}
     async  createVehicle(){
        try {
           const berline=    this.vehicleRepository.create({
          vehicleType:'BERLINE',
          pricePerKm:3,
          fixedRoutes:[
    { start: 'Orly', destination: 'Paris Left Bank', price: 50,  },
    { start: 'Orly', destination: 'Paris Right Bank', price: 60 },
    { start: 'CDG', destination: 'Paris Right Bank', price: 70 },
    { start: 'CDG', destination: 'Paris Left Bank', price: 80 },
    { start: 'CDG', destination: 'Disneyland', price: 90 },
    { start: 'Orly', destination: 'Disneyland', price: 70 }

          ]
        });
            const van=    this.vehicleRepository.create({
          vehicleType:'VAN',
          pricePerKm:5,
          fixedRoutes:[
       { "start": "Orly", "destination": "Paris Left Bank", "price": 100 },
      { "start": "Orly", "destination": "Paris Right Bank", "price": 100 },
      { "start": "CDG", "destination": "Paris Left Bank", "price": 120 },
      { "start": "CDG", "destination": "Paris Right Bank", "price": 120 },
      { "start": "Orly", "destination": "Disneyland", "price": 100 },
      { "start": "CDG", "destination": "Disneyland", "price": 120 }

          ]
        });
      this.vehicleRepository.save(berline);
      this.vehicleRepository.save(van);
        } catch (error) {
         throw new InternalServerErrorException(error.message); 
        }
    }

   async getVehicles(){
      return await this.vehicleRepository.find({relations:['fixedRoutes']});
    }


   async manageVehicles(dto: UpdateVehicleDto, vehicleId:string){
        try {
          const updated =   await this.vehicleRepository.update(
             {vehicleId},
            {
                price: dto.price,
                pricePerKm: dto.pricePerKm
             });
          
            return updated;
        } catch (error) {
         throw new InternalServerErrorException(error.message);
        }
    }

    async manageRoute(dto:RouteDto, routeId:string){
       try {
        console.log(dto)
          return   await this.fixedRouteRepository.update(
             {routeId},
            {
                price: dto.price
             });
            
        } catch (error) {
          console.log(error)
         throw new InternalServerErrorException(error.message);
        }
    }
}