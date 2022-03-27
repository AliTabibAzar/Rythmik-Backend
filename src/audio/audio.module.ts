import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { AuthModule } from 'src/auth/auth.module';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { Audio, AudioSchema } from './schemas/audio.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Audio.name, schema: AudioSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [AudioController],
  providers: [AudioService],
})
export class AudioModule {}
