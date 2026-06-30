import { Injectable, Logger } from "@nestjs/common";
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

// 익명: 400회/일 (~3.6분), 인증: 4000회/일 (~21초)
const FETCH_INTERVAL_MS = 60_000;
const MOCK_COUNT = 800;

@Injectable()
export class OpenSkyService {
  private readonly logger = new Logger(OpenSkyService.name);
  private readonly API_URL = "https://opensky-network.org/api/states/all";
  private readonly useMock = process.env.OPENSKY_USE_MOCK === "true";

  private cache: FlightStatesResponseDto | null = null;
  private lastFetchAt = 0;

  constructor(private readonly httpService: HttpService) {}

  async getFlightStates(): Promise<FlightStatesResponseDto | null> {
    if (this.useMock) {
      return this.getMockData();
    }

    const now = Date.now();
    if (this.cache && now - this.lastFetchAt < FETCH_INTERVAL_MS) {
      return this.cache;
    }
    this.lastFetchAt = now;

    const username = process.env.OPENSKY_CLIENT_ID;
    const password = process.env.OPENSKY_CLIENT_SECRET;

    const headers: Record<string, string> = {};
    if (username && password) {
      const credentials = Buffer.from(`${username}:${password}`).toString(
        "base64",
      );
      headers["Authorization"] = `Basic ${credentials}`;
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IOpenSkyRawResponse>(this.API_URL, { headers }),
      );
      this.cache = this.parseResponse(data);
      this.logger.log(`OpenSky fetch 성공: ${this.cache.states.length}대`);
      return this.cache;
    } catch (err: unknown) {
      const status =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;

      this.logger.warn(`OpenSky API 실패 (${status ?? "unknown"}) - 캐시 반환`);
      return this.cache;
    }
  }

  private getMockData(): FlightStatesResponseDto {
    const states: FlightStateDto[] = Array.from({ length: MOCK_COUNT }, (_, i) => ({
      icao24: i.toString(16).padStart(6, "0"),
      callsign: `FL${String(i).padStart(4, "0")}`,
      originCountry: "Mock",
      longitude: Math.random() * 360 - 180,
      latitude: Math.random() * 140 - 70,
      baroAltitude: 8000 + Math.random() * 4000,
      onGround: false,
      velocity: 200 + Math.random() * 300,
      trueTrack: Math.random() * 360,
      verticalRate: 0,
    }));

    return { time: Math.floor(Date.now() / 1000), states };
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
