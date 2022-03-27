import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'وارد کردن عنوان الزامی است.' })
  title: string;
}
