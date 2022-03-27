import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Audio, AudioDocument } from 'src/audio/schemas/audio.schema';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Audio.name) private audioModel: Model<AudioDocument>,
  ) {}

  //  save audio file path to the database
  public async upload(
    user: User,
    audioID: string,
    key: string,
  ): Promise<{ message: string; audio: Audio }> {
    const audio = await this.audioModel.findOneAndUpdate(
      { _id: audioID, user: user._id },
      {
        $set: { audio_s3_key: key },
      },
      { new: true },
    );
    if (!audio) {
      throw new NotFoundException('اطلاعات مربوط به فایل در دیتابیس یافت نشد.');
    }
    return { message: 'فایل مورد نظر با موفقیت آپلود شد.', audio: audio };
  }

  //  save audio image cover file path to the database
  public async uploadCover(
    user: User,
    audioID: string,
    location: string,
  ): Promise<{ message: string; audio: Audio }> {
    const audio = await this.audioModel.findOneAndUpdate(
      { _id: audioID, user: user._id },
      {
        $set: { audio_cover: location },
      },
      { new: true },
    );
    if (!audio) {
      throw new NotFoundException('اطلاعات مربوط به فایل در دیتابیس یافت نشد.');
    }
    return { message: 'فایل مورد نظر با موفقیت آپلود شد.', audio: audio };
  }

  // private async s3upload(
  //   file: Express.Multer.File,
  //   bucket: string,
  //   name: string,
  // ) {
  //   const params = {
  //     Bucket: bucket,
  //     Key: String(name),
  //     Body: file,
  //   };
  // }
}
