import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenSkyController } from '@modules/opensky/opensky.controller';
import { OpenSkyService } from '@modules/opensky/opensky.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
    }),
  ],
  controllers: [OpenSkyController],
  providers: [OpenSkyService],
  exports: [OpenSkyService],
})
export class OpenSkyModule {}
