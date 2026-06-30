import { Controller, Get } from '@nestjs/common';
import { OpenSkyService } from '@modules/opensky/opensky.service';
import { FlightStatesResponseDto } from '@modules/opensky/dto/flight-state.dto';

@Controller('opensky')
export class OpenSkyController {
  constructor(private readonly openSkyService: OpenSkyService) {}

  /**
   * 전 세계 항공기 실시간 상태 조회
   * @returns 항공기 상태 목록 (위치, 속도, 고도 등)
   */
  @Get('states')
  async getStates(): Promise<FlightStatesResponseDto | null> {
    return this.openSkyService.getFlightStates();
  }
}
