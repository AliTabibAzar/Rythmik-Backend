import { Exclude, Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { User } from '../schemas/user.schema';

export class UserTransform extends User {
  @Transform((value) => value.obj._id.toString())
  _id: Types.ObjectId;
  @Exclude()
  password: string;
  @Exclude()
  __v: number;
}
