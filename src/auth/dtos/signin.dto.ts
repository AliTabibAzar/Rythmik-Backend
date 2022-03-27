import { IsNotEmpty, Matches } from 'class-validator';
export class SignInDto {
  @IsNotEmpty({
    message: 'وارد کردن نام کاربری یا ایمیل الزامی است.',
  })
  usernameOrEmail: string;
  @IsNotEmpty({
    message: 'وارد کردن رمز عبور الزامی است.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, {
    message:
      'رمز عبور باید حاوی حداقل یک حرف بزرگ, یک عدد و بزرگتر از 8 حرف باشد.',
  })
  password: string;
}
