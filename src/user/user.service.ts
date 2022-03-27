import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SocialDto } from './dtos/social.dto';
import { UserDto } from './dtos/user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Find a user and return the user data
  public async getUser(userID: string): Promise<{ user: User }> {
    return { user: await this.userModel.findById(userID).populate('likes') };
  }
  // Update a user data and return it
  public async updateUser(
    userID: string,
    userDto: UserDto,
  ): Promise<{ message: string; user: User }> {
    const usernameIsExist = await this.userModel.findOne({
      _id: { $ne: userID },
      username: userDto.username,
    });
    if (usernameIsExist) {
      throw new ConflictException('نام کاربری وارد شده تکراری است.');
    }
    const user = await this.userModel
      .findByIdAndUpdate(userID, userDto, { new: true })
      .populate('likes');
    return { message: 'اطلاعات کاربر با موفقیت بروزرسانی شد.', user: user };
  }

  // Update user social medias
  public async updateSocial(
    userID: string,
    socialDto: SocialDto,
  ): Promise<{ message: string; user: User }> {
    const user = await this.userModel
      .findByIdAndUpdate(userID, { socials: socialDto }, { new: true })
      .populate('likes');
    return {
      message: 'شبکه های اجتماعی کاربر با موفقیت بروزرسانی شد.',
      user: user,
    };
  }

  // fallow a user
  public async fallowUser(
    userID: string,
    fallowID: string,
  ): Promise<{ message: string }> {
    await this.userModel.findOneAndUpdate(
      {
        _id: userID,
      },
      { $addToSet: { fallowed: fallowID } },
    );
    await this.userModel.findOneAndUpdate(
      {
        _id: fallowID,
      },
      { $addToSet: { fallowers: userID } },
    );
    return {
      message: 'کاربر مورد نظر با موفقیت فالو شد.',
    };
  }

  // unfallow a user
  public async unFallowUser(
    userID: string,
    fallowID: string,
  ): Promise<{ message: string }> {
    await this.userModel.findOneAndUpdate(
      {
        _id: userID,
      },
      { $pull: { fallowed: fallowID } },
    );
    await this.userModel.findOneAndUpdate(
      {
        _id: fallowID,
      },
      { $pull: { fallowers: userID } },
    );
    return {
      message: 'کاربر مورد نظر با موفقیت آنفالو شد.',
    };
  }
}
