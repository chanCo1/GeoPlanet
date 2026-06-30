'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { IFlightStatesResponse } from '@/shared/types/flight';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ['websocket'] });
  }
  return socket;
}

export function useFlights(): IFlightStatesResponse | null {
  const [data, setData] = useState<IFlightStatesResponse | null>(null);
  console.log(data)

  useEffect(() => {
    const s = getSocket();

    const handler = (payload: IFlightStatesResponse) => {
      setData(payload);
    };

    s.on('flights:update', handler);

    return () => {
      s.off('flights:update', handler);
    };
  }, []);

  return data;
}
