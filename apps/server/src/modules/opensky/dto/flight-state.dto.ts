export class FlightStateDto {
  icao24!: string;
  callsign!: string | null;
  originCountry!: string;
  longitude!: number | null;
  latitude!: number | null;
  baroAltitude!: number | null;
  onGround!: boolean;
  velocity!: number | null;
  trueTrack!: number | null;
  verticalRate!: number | null;
}

export class FlightStatesResponseDto {
  time!: number;
  states!: FlightStateDto[];
}
