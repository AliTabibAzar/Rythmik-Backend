import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Audio } from 'src/audio/schemas/audio.schema';

export type CategoryDocument = Category & Document;
@Schema({ timestamps: true })
export class Category {
  _id: Types.ObjectId;
  @Prop({ required: true, unique: true })
  title: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
