import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  PayloadTooLargeException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { writeFileSync } from 'fs';
import { Observable } from 'rxjs';
import { join } from 'path';

@Injectable()
export class UploadB64ImageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const audio_cover: string = context.switchToHttp().getRequest().body[
      'audio_cover'
    ];
    if (audio_cover) {
      const imageSize = audio_cover.length / 1e6;
      if (imageSize < 0.5) {
        const isValidate = audio_cover.match(
          /(data:image\/(jpg|jpeg|png|webp)+;base64[^"]+)/,
        );
        if (isValidate != null) {
          const base64Image = audio_cover.replace(
            /^data:image\/[^;]*;base64,?/,
            '',
          );
          const filePath = `public/upload/cover/${uuidv4()}.webp`;

          try {
            writeFileSync(
              join(`${process.cwd()}/${filePath}`),
              base64Image,
              'base64',
            );
            context.switchToHttp().getRequest().body['audio_cover'] = filePath;
          } catch (error) {
            throw new InternalServerErrorException(
              'Unable to create audio cover',
            );
          }
        } else {
          throw new BadRequestException(
            'فقط فایل های عکس اجازه ی آپلود دارند.',
          );
        }
      } else {
        throw new PayloadTooLargeException(
          'محدودیت آپلود عکس 500 کیلوبایت می باشد.',
        );
      }
    }
    return next.handle();
  }
}
