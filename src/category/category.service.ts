import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Audio, AudioDocument } from 'src/audio/schemas/audio.schema';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

const perPage = 20;

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Audio.name) private audioModel: Model<AudioDocument>,
  ) {}

  public async findAll(): Promise<{ categories: Category[] }> {
    return { categories: await this.categoryModel.find() };
  }

  public async getAudios(
    categoryID: string,
    page: number,
    sortBy: string,
  ): Promise<{ audios: Audio[] }> {
    try {
      const audios = await this.audioModel
        .aggregate()
        .match({ category: categoryID })
        .addFields({ likes_count: { $size: '$likes' } })
        .sort({ [sortBy]: -1 });
      return { audios };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  public async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ message: string; category: Category }> {
    try {
      const category = await new this.categoryModel(createCategoryDto).save();
      return {
        message: 'سبک مورد نظر با موفقیت اضافه شد.',
        category: category,
      };
    } catch (error) {
      if (error.code == 11000) {
        throw new ConflictException('سبک وارد شده تکراری می باشد.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  public async delete(
    categoryID: string,
  ): Promise<{ message: string; category: Category }> {
    const category = await this.categoryModel.findByIdAndDelete(categoryID);
    if (!category) {
      throw new NotFoundException('سبک مورد نظر یافت نشد.');
    }
    return {
      message: 'سبک مورد نظر با موفقیت حذف شد.',
      category: category,
    };
  }
}
