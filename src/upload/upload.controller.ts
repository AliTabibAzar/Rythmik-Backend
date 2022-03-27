import {
  BadRequestException,
  Controller,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import * as multerS3 from 'multer-s3';
import { Audio } from 'src/audio/schemas/audio.schema';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { S3Provicer } from 'src/common/providers/s3.provider';
import { User } from 'src/user/schemas/user.schema';
import { audioFileFilter } from './filters/audio.filter';
import { imageFileFilter } from './filters/image.filter';
import { UploadService } from './upload.service';
import { editFileName } from './utils/file-name.util';

const s3 = new S3Provicer().getS3();

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}
  // Upload audio handler
  @UseGuards(AuthGuard())
  @Patch('/audio/:audio_id')
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: multerS3({
        s3: s3,
        bucket: 'rythmik-audio',
        key: editFileName,
      }),
      limits: { fileSize: 15 * 1024 * 1024 },
      fileFilter: audioFileFilter,
    }),
  )
  public async upload(
    @GetUser() user: User,
    @Param('audio_id') audioID: string,
    @UploadedFile() file: any,
  ): Promise<unknown> {
    if (!file) {
      throw new BadRequestException('انتخاب فایل جهت آپلود الزامی است.');
    }
    return await this.uploadService.upload(user, audioID, file.key);
  }

  // Upload audio image cover handler
  @UseGuards(AuthGuard())
  @Patch('/cover/:audio_id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multerS3({
        s3: s3,
        bucket: 'rythmik-cover',
        key: editFileName,
      }),
      limits: { fileSize: 0.5 * 1024 * 1024 },
      fileFilter: imageFileFilter,
    }),
  )
  public async uploadCover(
    @GetUser() user: User,
    @Param('audio_id') audioID: string,
    @UploadedFile() file: any,
  ): Promise<{ message: string; audio: Audio }> {
    if (!file) {
      throw new BadRequestException('انتخاب فایل جهت آپلود الزامی است.');
    }
    return await this.uploadService.uploadCover(user, audioID, file.location);
  }
}
