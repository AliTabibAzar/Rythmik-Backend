import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendUserForgotPasswordLink(
    user: User,
    verificationToken: string,
  ) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'درخواست تغییر رمز عبور',
      template: 'forgot-password',
      context: {
        name: user.fullname,
        url: `http://localhost:3000/forgostPassword/${user.email}/${verificationToken}`,
      },
    });
  }
}
