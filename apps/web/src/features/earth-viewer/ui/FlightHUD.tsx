'use client';

import type { IFlightStatesResponse } from '@/shared/types/flight';

interface IProps {
  data: IFlightStatesResponse | null;
}

export function FlightHUD({ data }: IProps) {
  const total = data?.states.length ?? 0;
  const airborne = data?.states.filter((s) => !s.onGround).length ?? 0;
  const updatedAt = data
    ? new Date(data.time * 1000).toLocaleTimeString('ko-KR')
    : null;

  return (
    <div className="absolute top-4 right-4 z-10 font-mono text-xs select-none">
      <div className="bg-black/60 border border-[#2dbdb6]/30 rounded px-3 py-2.5 text-[#2dbdb6] space-y-1 min-w-[130px]">
        <p className="text-white/50 uppercase tracking-widest text-[9px]">OpenSky Live</p>
        {data ? (
          <>
            <p>
              총{' '}
              <span className="text-white font-bold">
                {total.toLocaleString()}
              </span>{' '}
              대
            </p>
            <p>
              비행중{' '}
              <span className="text-white font-bold">
                {airborne.toLocaleString()}
              </span>{' '}
              대
            </p>
            <p className="text-white/30 text-[9px] pt-0.5">갱신 {updatedAt}</p>
          </>
        ) : (
          <p className="text-white/40 animate-pulse">연결 중...</p>
        )}
      </div>
    </div>
  );
}
