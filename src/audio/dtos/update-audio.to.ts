import { IsMongoId, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Category } from 'src/category/schemas/category.schema';
import { Access } from '../enums/access.enum';

export class UpdateAudioDto {
  @IsNotEmpty({ message: 'وارد کردن عنوان الزامی است.' })
  title: string;
  @IsNotEmpty({ message: 'وارد کردن نام هنرمند الزامی است.' })
  artist: string;
  @IsOptional()
  partners: string;
  @IsNotEmpty({ message: 'وارد کردن سبک الزامی است.' })
  @IsMongoId({ message: 'شناسه سبک وارد شده یک شناسه معتبر نمی باشد.' })
  category: Category;
  @IsOptional()
  lyrics: string;
  @IsNotEmpty({ message: 'وارد کردن سال پخش الزامی است.' })
  release_date: number;
  @IsOptional()
  access: Access;
  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'فرمت لینک وارد شده غیر معتبر می باشد.',
  })
  slug: string;
}
