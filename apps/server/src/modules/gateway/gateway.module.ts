import { Module } from '@nestjs/common';
import { OpenSkyModule } from '@modules/opensky/opensky.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [OpenSkyModule],
  providers: [EventsGateway],
})
export class GatewayModule {}
