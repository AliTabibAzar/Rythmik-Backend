import { IsNotEmpty, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty({
    message: 'وارد کردن ایمیل الزامی است.',
  })
  @IsEmail(undefined, { message: 'ایمیل وارد شده غیر معتبر می باشد.' })
  email: string;
}
