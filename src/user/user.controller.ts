import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { SocialDto } from './dtos/social.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  // UserController constructor
  constructor(private userService: UserService) {}

  // Get user handler
  @Get('/')
  public async getUser(@GetUser() user: User): Promise<{ user: User }> {
    return await this.userService.getUser(user._id.toString());
  }

  // Update user handler
  @Patch('/')
  public async updateUser(
    @GetUser() user: User,
    @Body() userDto: UserDto,
  ): Promise<{ user: User }> {
    return await this.userService.updateUser(user._id.toString(), userDto);
  }

  // Update user social medias handler
  @Patch('/socials')
  public async updateSocial(
    @GetUser() user: User,
    @Body() socialDto: SocialDto,
  ): Promise<{ user: User }> {
    return await this.userService.updateSocial(user._id.toString(), socialDto);
  }

  // fallow a user handler
  @Get('/fallow/:fallow_id')
  public async fallowUser(
    @GetUser() user: User,
    @Param('fallow_id') fallowID: string,
  ): Promise<{ message: string }> {
    return await this.userService.fallowUser(user._id.toString(), fallowID);
  }

  // unfallow a user handler
  @Get('/unfallow/:fallow_id')
  public async unFallowUser(
    @GetUser() user: User,
    @Param('fallow_id') fallowID: string,
  ): Promise<{ message: string }> {
    return await this.userService.unFallowUser(user._id.toString(), fallowID);
  }
}
