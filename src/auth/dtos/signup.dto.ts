import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({
    message: 'وارد کردن نام الزامی است.',
  })
  fullname: string;
  @IsNotEmpty({
    message: 'وارد کردن نام کاربری الزامی است.',
  })
  @Matches(/^(?=.{3,20}$)(?![_.0-9])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, {
    message: 'نام کاربری وارد شده غیر معتبر می باشد.',
  })
  username: string;
  @IsNotEmpty({
    message: 'وارد کردن ایمیل الزامی است.',
  })
  @IsEmail(undefined, { message: 'ایمیل وارد شده غیر معتبر می باشد.' })
  email: string;
  @IsNotEmpty({
    message: 'وارد کردن رمز عبور الزامی است.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, {
    message:
      'رمز عبور باید حاوی حداقل یک حرف بزرگ, یک عدد و بزرگتر از 8 حرف باشد.',
  })
  password: string;
}
