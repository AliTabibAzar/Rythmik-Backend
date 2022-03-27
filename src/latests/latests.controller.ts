import { Controller, Get, Query } from '@nestjs/common';
import { LatestsService } from './latests.service';
import { Audio } from 'src/audio/schemas/audio.schema';

@Controller('latests')
export class LatestsController {
  constructor(private latestsService: LatestsService) {}

  @Get('/')
  public async getLatests(
    @Query('page') page: number,
  ): Promise<{ audios: Audio[] }> {
    return await this.latestsService.getLatests(page);
  }

  @Get('/trending')
  public async getTrending(
    @Query('page') page: number,
  ): Promise<{ audios: Audio[] }> {
    return await this.latestsService.getTrending(page);
  }

  @Get('/untrending')
  public async getUnTrending(
    @Query('page') page: number,
  ): Promise<{ audios: Audio[] }> {
    return await this.latestsService.getUnTrending(page);
  }
}
