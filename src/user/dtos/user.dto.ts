import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'وارد کردن نام الزامی است.' })
  fullname: string;
  @IsNotEmpty({ message: 'وارد کردن نام کاربری الزامی است.' })
  username: string;
  bio: string;
}
