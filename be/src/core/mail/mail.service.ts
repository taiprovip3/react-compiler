import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  async sendEmailVerification(to: string, token: string) {
    const transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });

    const verifyUrl = `${this.configService.get('FRONTEND_VERIFY_URL')}?token=${token}`;
    await transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to,
      subject: 'nhinguyen Blogger',
      html: `<p>Vui lòng nhấn vào link bên dưới để xác thực email:</p><a href="${verifyUrl}">${verifyUrl}</a>`,
    });
  }
}
