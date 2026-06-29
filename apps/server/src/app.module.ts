import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './modules/gateway/gateway.module';

@Module({
  imports: [ScheduleModule.forRoot(), GatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
