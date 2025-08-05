import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FixedRoutes } from "./routes.entity";

@Entity('vechicle')

export class VehicleEntity {
    @PrimaryGeneratedColumn('uuid')
    vehicleId:string

    @Column()
    vehicleType:string

    @Column('float', {default:0})
    price:number

    @Column('float', {default:0})
    pricePerKm:number

   @OneToMany(()=>FixedRoutes, route=>route.vehicleType, {cascade:true})
   fixedRoutes:FixedRoutes[]
}

