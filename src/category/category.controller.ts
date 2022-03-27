import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './schemas/category.schema';
import { Audio } from 'src/audio/schemas/audio.schema';

@Controller('category')
export class CategoryController {
  constructor(private categoriesService: CategoryService) {}

  // Get all categories
  @Get('/all')
  public async findAll(): Promise<{ categories: Category[] }> {
    return await this.categoriesService.findAll();
  }

  // Get audios from category
  @Get('/:category_id')
  public async getAudios(
    @Param('category_id') categoryID: string,
    @Query('page') page: number,
    @Query('sortBy') sortBy: string,
  ): Promise<{ audios: Audio[] }> {
    return await this.categoriesService.getAudios(categoryID, page, sortBy);
  }

  // Create a category
  @Roles(Role.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @Post('/')
  public async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<{ message: string; category: Category }> {
    return await this.categoriesService.create(createCategoryDto);
  }

  // Delete a category
  @Roles(Role.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @Delete('/:audio_id')
  public async delete(
    @Param('audio_id') audioID: string,
  ): Promise<{ message: string; category: Category }> {
    return await this.categoriesService.delete(audioID);
  }
}
