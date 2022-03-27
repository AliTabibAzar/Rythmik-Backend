import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Audio, AudioSchema } from 'src/audio/schemas/audio.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategorySchema } from './schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Audio.name, schema: AudioSchema },
    ]),
    AuthModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
