import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { Types } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';
import { Audio } from 'src/audio/schemas/audio.schema';

export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;
  @Prop()
  _sid: string;
  @Prop({ required: true })
  fullname: string;
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, select: false })
  password: string;
  @Prop()
  profile_picture: string;
  @Prop()
  bio: string;
  @Prop({ type: Array })
  socials: {
    instagram: string;
    facebook: string;
    twitter: string;
    telegram: string;
  };
  roles: Role[];
  @Prop({ type: [Types.ObjectId], ref: 'Audio' })
  likes: Audio[];
  @Prop({ default: Role.User })
  @Prop({ type: [Types.ObjectId], ref: 'User' })
  fallowed: this[];
  @Prop({ type: [Types.ObjectId], ref: 'User' })
  fallowers: this[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('likes_count').get(function () {
  return this.likes.length;
});
UserSchema.virtual('fallowers_count').get(function () {
  return this.fallowers.length;
});
UserSchema.virtual('fallowed_count').get(function () {
  return this.fallowed.length;
});

UserSchema.methods.comparePassword = function (password): boolean {
  if (this.password) return compareSync(password, this.password);
};
UserSchema.pre('save', function (this: UserDocument, next) {
  const salt = genSaltSync(15);
  this.password = hashSync(this.password, salt);
  next();
});
UserSchema.pre('updateOne', function (this: any, next) {
  if (this._update.password) {
    const salt = genSaltSync(15);
    this._update.password = hashSync(this._update.password, salt);
  }
  next();
});
