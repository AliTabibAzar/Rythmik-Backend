import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (_req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
    return callback(
      new BadRequestException('فقط فایل های عکس اجازه ی آپلود دارند.'),
      false,
    );
  }
  callback(null, true);
};
