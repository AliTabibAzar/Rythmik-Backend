import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Category } from 'src/category/schemas/category.schema';
import { User } from 'src/user/schemas/user.schema';
import { Access } from '../enums/access.enum';

export type AudioDocument = Audio & Document;
@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Audio {
  _id: Types.ObjectId;
  @Prop()
  _sid: string;
  @Prop()
  title: string;
  @Prop()
  artist: string;
  @Prop()
  partners: string;
  @Prop({ type: Types.ObjectId, ref: 'Category', autopopulate: true })
  category: Category;
  @Prop()
  lyrics: string;
  @Prop()
  release_date: number;
  @Prop({ default: Access.PUBLIC })
  access: Access;
  @Prop()
  audio_s3_key: string;
  @Prop()
  audio_cover: string;
  @Prop()
  slug: string;
  @Prop({ type: Types.ObjectId, ref: 'User', autopopulate: true })
  user: User;
  @Prop({ type: [Types.ObjectId], ref: 'User' })
  likes: User[];
  likes_count: number;
  @Prop({ default: 0 })
  play_count: number;
}

export const AudioSchema = SchemaFactory.createForClass(Audio);

AudioSchema.virtual('likes_count').get(function () {
  return this.likes.length;
});
AudioSchema.virtual('has_liked').get(function () {
  return this.likes.includes(this.user._id);
});
