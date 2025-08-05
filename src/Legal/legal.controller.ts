import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { LegalQuery, UpdateContentDto } from "./dto/content-dto";
import { LegalService } from "./legal.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
@ApiTags('Legal pages')
@Controller('legal')
export class LegalController {
    constructor(
        private readonly legalService: LegalService
    ){}
     
    @Post()
     async  createContent(@Body()dto:UpdateContentDto){
      return this.legalService.createLegalContent(dto);
     }
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
     @Patch(':postId')
     async updateLegalContent(@Body()dto:UpdateContentDto, @Param('postId')postId:string){
      return this.legalService.updateLegalContent(dto, postId);
    }

       @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
     @Delete(':postId')
     async deleteLegalContent(@Param('postId')postId:string){
      return this.legalService.deleteContent( postId);
    }

    @Get()
    async getContent(@Query()dto:LegalQuery){
        return this.legalService.getContent(dto)
    }
}