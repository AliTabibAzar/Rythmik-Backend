import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/user/schemas/user.schema';
import { AudioService } from './audio.service';
import { UpdateAudioDto } from './dtos/update-audio.to';
import { Audio } from './schemas/audio.schema';
import { Response, Request } from 'express';
import { S3Provicer } from 'src/common/providers/s3.provider';

@Controller('audio')
export class AudioController {
  constructor(private audioService: AudioService) {}

  // Create a empty audio document with user data
  @UseGuards(AuthGuard())
  @Get('/create')
  public async create(@GetUser() user: User): Promise<{ audio: Audio }> {
    return await this.audioService.create(user);
  }
  // Get all audios
  @Get('/all')
  public async findAll(): Promise<{ audios: Audio[] }> {
    return await this.audioService.findAll();
  }

  // PLay audio
  @Get('/:audio_id/play')
  public async playAudio(
    @Res() res: Response,
    @Req() req: Request,
    @Param('audio_id') audioID: string,
  ) {
    try {
      const audio = await this.audioService.playAudio(audioID);
      const audioSize = await new S3Provicer().sizeOf(
        audio.audio_s3_key,
        'rythmik-audio',
      );
      if (req.headers.range) {
        const range = req.headers.range;
        const parts = range.replace(/bytes=/, '').split('-');
        const partialstart = parts[0];
        const partialend = parts[1];
        const start = parseInt(partialstart, 10);
        const end = partialend ? parseInt(partialend, 10) : audioSize - 1;
        const chunksize = end - start + 1;
        const audioRange = 'bytes ' + start + '-' + end + '/' + audioSize;
        res.writeHead(206, {
          'Content-Range': audioRange,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'audio/mpeg',
        });
        new S3Provicer()
          .getFileStream(audio.audio_s3_key, 'rythmik-audio', range)
          .on('error', (error: any) => {
            if (error.statusCode == 404) {
              res.status(500).send({
                statusCode: 404,
                message: 'فایل صوتی یافت نشد !',
                error: 'Not Found',
              });
            }
          });
      } else {
        res.writeHead(200, {
          'Content-Length': audioSize,
          'Content-Type': 'audio/mpeg',
        });
        new S3Provicer()
          .getFileStream(audio.audio_s3_key, 'rythmik-audio')
          .on('error', (error: any) => {
            if (error.statusCode == 404) {
              res.status(500).send({
                statusCode: 404,
                message: 'فایل صوتی یافت نشد !',
                error: 'Not Found',
              });
            }
          })
          .pipe(res);
      }
    } catch (error) {
      throw new InternalServerErrorException('خطا در اجرای فایل صوتی.');
    }
  }

  // Like audio
  @UseGuards(AuthGuard())
  @Get('/:audio_id/like')
  public async likeAudio(
    @Param('audio_id') audioID: string,
    @GetUser() user: User,
  ): Promise<{ message: string; audio: Audio }> {
    return await this.audioService.likeAudio(audioID, user);
  }

  // UnLike audio
  @UseGuards(AuthGuard())
  @Get('/:audio_id/unlike')
  public async unLikeAudio(
    @Param('audio_id') audioID: string,
    @GetUser() user: User,
  ): Promise<{ message: string; audio: Audio }> {
    return await this.audioService.unLikeAudio(audioID, user);
  }
  // Get an audio by slug
  @Get('/:username/:slug')
  public async findOneBySlug(
    @Param('username') username: string,
    @Param('slug') slug: string,
  ): Promise<{ audio: Audio }> {
    return await this.audioService.findOneBySlug(username, slug);
  }

  // Get an audio by object id
  @Get('/:audio_id')
  public async findOneByObjectID(
    @Param('audio_id') audioID: string,
  ): Promise<{ audio: Audio }> {
    return await this.audioService.findOneByObjectID(audioID);
  }

  // Delete a audio
  @UseGuards(AuthGuard())
  @Delete('/:audio_id')
  public async delete(
    @GetUser() user: User,
    @Param('audio_id') audioID: string,
  ): Promise<{ message: string; audio: Audio }> {
    return await this.audioService.delete(user, audioID);
  }

  // Update audio
  @UseGuards(AuthGuard())
  @Patch('/:audio_id')
  public async update(
    @GetUser() user: User,
    @Param('audio_id') audioID: string,
    @Body() updateAudioDto: UpdateAudioDto,
  ): Promise<{ message: string; audio: Audio }> {
    return await this.audioService.update(user, audioID, updateAudioDto);
  }
}
