import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OpenSkyService } from '@modules/opensky/opensky.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(EventsGateway.name);

  constructor(private readonly openSkyService: OpenSkyService) {}

  afterInit(): void {
    this.logger.log('WebSocket Gateway initialized');
    // 서버 시작 시 첫 데이터 즉시 fetch
    void this.openSkyService.getFlightStates();
  }

  async handleConnection(client: Socket): Promise<void> {
    this.logger.log(`Client connected: ${client.id}`);
    // 접속 즉시 캐시 데이터 전송 (크론 주기 기다리지 않음)
    const data = await this.openSkyService.getFlightStates();
    if (data) {
      client.emit('flights:update', data);
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(_client: Socket, payload: unknown): void {
    this.server.emit('message', payload);
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async broadcastFlights(): Promise<void> {
    if (this.server.sockets.sockets.size === 0) return;

    const data = await this.openSkyService.getFlightStates();
    if (data) {
      this.server.emit('flights:update', data);
    }
  }
}
