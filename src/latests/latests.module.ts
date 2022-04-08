import { Module } from '@nestjs/common';
import { LatestsService } from './latests.service';
import { LatestsController } from './latests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AudioSchema, Audio } from 'src/audio/schemas/audio.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Audio.name, schema: AudioSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [LatestsService],
  controllers: [LatestsController],
})
export class LatestsModule {}
