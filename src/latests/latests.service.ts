import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AudioDocument, Audio } from 'src/audio/schemas/audio.schema';
import { User, UserDocument } from 'src/user/schemas/user.schema';

const perPage = 20;

@Injectable()
export class LatestsService {
  constructor(
    @InjectModel(Audio.name) private audioModel: Model<AudioDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  public async getLatests(page: number): Promise<{ audios: Audio[] }> {
    const audios = await this.audioModel
      .find({ title: { $ne: null }, audio_s3_key: { $ne: null } })
      .sort('-createdAt')
      .skip((page - 1) * perPage)
      .limit(perPage);
    return { audios };
  }

  public async getTrending(page: number): Promise<{ audios: Audio[] }> {
    const audios = await this.audioModel
      .find({ title: { $ne: null }, audio_s3_key: { $ne: null } })
      .sort('-play_count')
      .skip((page - 1) * perPage)
      .limit(perPage);
    return { audios };
  }

  public async getUnTrending(page: number): Promise<{ audios: Audio[] }> {
    const audios = await this.audioModel
      .find({ title: { $ne: null }, audio_s3_key: { $ne: null } })
      .sort('play_count')
      .skip((page - 1) * perPage)
      .limit(perPage);
    return { audios };
  }

  public async getArtists(page: number): Promise<{ artists: User[] }> {
    const artists = await this.userModel
      .aggregate()
      .addFields({ fallowers_count: { $size: '$fallowers' } })
      .sort({ fallowers_count: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
    return { artists };
  }
}
