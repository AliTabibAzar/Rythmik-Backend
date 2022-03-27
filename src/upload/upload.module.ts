import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { MulterModule } from '@nestjs/platform-express';
import { AudioSchema, Audio } from 'src/audio/schemas/audio.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Audio.name, schema: AudioSchema }]),
    MulterModule.register({
      dest: './public/upload',
    }),
    AuthModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
