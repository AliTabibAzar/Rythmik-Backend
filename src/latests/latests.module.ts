import { Module } from '@nestjs/common';
import { LatestsService } from './latests.service';
import { LatestsController } from './latests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AudioSchema, Audio } from 'src/audio/schemas/audio.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Audio.name, schema: AudioSchema }]),
  ],
  providers: [LatestsService],
  controllers: [LatestsController],
})
export class LatestsModule {}
