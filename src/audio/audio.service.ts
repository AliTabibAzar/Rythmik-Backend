import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { UpdateAudioDto } from './dtos/update-audio.to';
import { Audio, AudioDocument } from './schemas/audio.schema';

@Injectable()
export class AudioService {
  constructor(
    @InjectModel(Audio.name) private audioModel: Model<AudioDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Get all audio from audio model
  public async findAll(): Promise<{ audios: Audio[] }> {
    const audios = await this.audioModel.find({ audio_s3_key: { $ne: null } });

    return { audios };
  }

  // Play audio
  public async playAudio(audioID: string): Promise<Audio> {
    const audio = await this.audioModel.findOneAndUpdate(
      {
        _id: audioID,
        audio_s3_key: { $ne: null },
      },
      { $inc: { play_count: 1 } },
      { new: true },
    );

    if (!audio) {
      throw new NotFoundException('فایل موسیقی جهت پخش کردن یافت نشد.');
    }
    return audio;
  }

  // Like audio
  public async likeAudio(
    audioID: string,
    user: User,
  ): Promise<{ message: string; audio: Audio }> {
    const audio = await this.audioModel.findOneAndUpdate(
      {
        _id: audioID,
        audio_s3_key: { $ne: null },
        likes: { $not: { $elemMatch: { $eq: user._id } } },
      },
      { $addToSet: { likes: user._id } },
      { new: true },
    );
    if (!audio) {
      throw new BadRequestException('لایک کردن با خطا مواجه شد.');
    }
    await this.userModel.updateOne(
      { _id: user._id },
      { $push: { likes: audio._id } },
    );
    return { message: 'موسیقی مورد نظر با موفقیت لایک شد.', audio: audio };
  }

  // UnLike audio
  public async unLikeAudio(
    audioID: string,
    user: User,
  ): Promise<{ message: string; audio: Audio }> {
    const audio = await this.audioModel.findOneAndUpdate(
      {
        _id: audioID,
        audio_s3_key: { $ne: null },
        likes: { $elemMatch: { $eq: user._id } },
      },
      { $pull: { likes: user._id } },
      { new: true },
    );
    if (!audio) {
      throw new BadRequestException('آنلایک کردن با خطا مواجه شد.');
    }
    await this.userModel.updateOne(
      { _id: user._id },
      { $pull: { likes: audio._id } },
    );
    return { message: 'موسیقی مورد نظر با موفقیت آنلایک شد.', audio: audio };
  }

  // find an audio from audio model by slug
  public async findOneBySlug(
    username: string,
    slug: string,
  ): Promise<{ audio: Audio }> {
    const audio = await this.audioModel.findOne({ slug }).populate({
      path: 'user',
      match: { username },
    });

    if (!audio || audio.user.username != username) {
      throw new NotFoundException('داده ای یافت نشد.');
    }
    return { audio };
  }

  // find an audio from audio model by object id
  public async findOneByObjectID(audioID: string): Promise<{ audio: Audio }> {
    const audio = await this.audioModel.findById(audioID);
    if (!audio) {
      throw new NotFoundException('داده ای یافت نشد.');
    }
    return { audio };
  }

  // Create a empty audio document for track upload
  public async create(user: User): Promise<{ audio: Audio }> {
    try {
      const audio = await this.audioModel.findOne({ audio_s3_key: null });
      if (!audio) {
        return { audio: await new this.audioModel({ user: user._id }).save() };
      } else {
        return { audio };
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // Delete audio
  public async delete(
    user: User,
    audioID: string,
  ): Promise<{ message: string; audio: Audio }> {
    const audio = await this.audioModel.findOneAndDelete({
      _id: audioID,
      user: user._id,
    });

    if (!audio) {
      throw new NotFoundException('داده ای یافت نشد.');
    }
    return { message: 'داده مورد نظر با موفقیت حذف شد.', audio: audio };
  }

  // Update audio
  public async update(
    user: User,
    audioID: string,
    updateAudioDto: UpdateAudioDto,
  ): Promise<{ message: string; audio: Audio }> {
    const audio = await this.audioModel.findOneAndUpdate(
      { _id: audioID, user: user._id },
      updateAudioDto,
      { new: true },
    );

    if (!audio) {
      throw new NotFoundException('اطلاعات مربوط به فایل در دیتابیس یافت نشد.');
    }

    return { message: 'اطلاعات با موفقیت به روز رسانی شد.', audio: audio };
  }
}
