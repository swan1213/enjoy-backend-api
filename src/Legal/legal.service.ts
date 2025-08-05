import { Repository } from "typeorm";

import { InjectRepository } from "@nestjs/typeorm";
import { LegalQuery, UpdateContentDto } from "./dto/content-dto";
import { LegalEntity } from "./entities/legal.entity";


export class LegalService {
    constructor(
        @InjectRepository(LegalEntity)
        private readonly legalRepo:Repository<LegalEntity>
    ){}

   
 async createLegalContent(dto: UpdateContentDto,){
      const legal = this.legalRepo.create({
         content:dto.content,
         language:dto.language,
         pageTitle:dto.pageTitle,
         title:dto.title
      }, )

      return await this.legalRepo.save(legal)
    }

    async updateLegalContent(dto: UpdateContentDto, postId:string){
      return await this.legalRepo.update({
        postId,
      }, {
        content: dto.content,
        pageTitle:dto.pageTitle,
        title: dto.title
      })
    }

    async deleteContent(postId:string){
      return await this.legalRepo.delete({postId})
    }

  async getContent(query:LegalQuery){
     const qb=  this.legalRepo
     .createQueryBuilder('legal')
     
  if (query.type|| query.langauage) {
    qb.where('LOWER(legal.pageTitle) = LOWER(:pageTitle)', {
      pageTitle: query.type,
    }).orWhere('LOWER(legal.language) = LOWER(:language)', {
      language: query.langauage,
    });

  }


   return await qb.getMany();
    }
}