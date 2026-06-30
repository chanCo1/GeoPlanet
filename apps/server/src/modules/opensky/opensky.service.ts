import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import {
  FlightStateDto,
  FlightStatesResponseDto,
} from "@modules/opensky/dto/flight-state.dto";

// OpenSky API 원본 응답 타입 (배열 형식)
type TRawState = [
  string, // 0: icao24
  string | null, // 1: callsign
  string, // 2: origin_country
  number | null, // 3: time_position
  number, // 4: last_contact
  number | null, // 5: longitude
  number | null, // 6: latitude
  number | null, // 7: baro_altitude
  boolean, // 8: on_ground
  number | null, // 9: velocity
  number | null, // 10: true_track
  number | null, // 11: vertical_rate
  number[] | null, // 12: sensors
  number | null, // 13: geo_altitude
  string | null, // 14: squawk
  boolean, // 15: spi
  number, // 16: position_source
];

interface IOpenSkyRawResponse {
  time: number;
  states: TRawState[] | null;
}

@Injectable()
export class OpenSkyService {
  private readonly API_URL = "https://opensky-network.org/api/states/all";

  constructor(private readonly httpService: HttpService) {}

  async getFlightStates(): Promise<FlightStatesResponseDto> {
    const username = process.env.OPENSKY_CLIENT_ID;
    const password = process.env.OPENSKY_CLIENT_SECRET;

    const headers: Record<string, string> = {};
    if (username && password) {
      // HTTP Basic Authentication: Base64 인코딩
      const credentials = Buffer.from(`${username}:${password}`).toString(
        "base64",
      );
      headers["Authorization"] = `Basic ${credentials}`;
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IOpenSkyRawResponse>(this.API_URL, { headers }),
      );
      return this.parseResponse(data);
    } catch {
      throw new InternalServerErrorException("OpenSky API 요청 실패");
    }
  }

  private parseResponse(data: IOpenSkyRawResponse): FlightStatesResponseDto {
    const states: FlightStateDto[] = (data.states ?? []).map((s) => ({
      icao24: s[0],
      callsign: s[1]?.trim() || null,
      originCountry: s[2],
      longitude: s[5],
      latitude: s[6],
      baroAltitude: s[7],
      onGround: s[8],
      velocity: s[9],
      trueTrack: s[10],
      verticalRate: s[11],
    }));

    return { time: data.time, states };
  }
}
