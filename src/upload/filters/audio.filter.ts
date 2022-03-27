import { BadRequestException } from '@nestjs/common';

export const audioFileFilter = (_req, file, callback) => {
  if (!file.originalname.match(/\.(mp3|m4a|flac|wav|alac|aiff)$/)) {
    return callback(
      new BadRequestException('فقط فایل های موسیقی اجازه ی آپلود دارند.'),
      false,
    );
  }
  callback(null, true);
};
