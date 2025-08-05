import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { VehicleEntity } from "./vehicle.entity";


@Entity()
export class FixedRoutes {
    @PrimaryGeneratedColumn('uuid')
    routeId:string

    @Column({nullable:true})
    start:string

    @Column({nullable:true})
    destination:string

    @Column('float', {default:0})
    price:number

    @Column({type:'uuid'})
    vehicleTypeId:string

    @ManyToOne(()=>VehicleEntity, vehicle=>vehicle.fixedRoutes, {onDelete:'CASCADE'})
    @JoinColumn({name:'vehicleTypeId', referencedColumnName:'vehicleId'})
    vehicleType:VehicleEntity
}