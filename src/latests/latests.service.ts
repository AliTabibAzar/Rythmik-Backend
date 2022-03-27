import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AudioDocument, Audio } from 'src/audio/schemas/audio.schema';

const perPage = 20;

@Injectable()
export class LatestsService {
  constructor(
    @InjectModel(Audio.name) private audioModel: Model<AudioDocument>,
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
}
