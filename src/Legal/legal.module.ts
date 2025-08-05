import { Injectable, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LegalController } from "./legal.controller";
import { LegalService } from "./legal.service";
import { LegalEntity } from "./entities/legal.entity";

@Module(
    {
        imports:[TypeOrmModule.forFeature([LegalEntity])],
        controllers:[LegalController],
        providers:[LegalService]
    }
)

export class LegalModule {}