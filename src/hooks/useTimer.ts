
import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseTimerResult {
  time: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  formattedTime: string;
}

export function useTimer(initialTime: number = 0, countDown: boolean = false, onComplete?: () => void): UseTimerResult {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          const newTime = countDown ? prev - 1 : prev + 1;
          if (countDown && newTime <= 0) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, countDown, onComplete]);

  const start = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setTime(initialTime);
  }, [initialTime]);

  const minutes = Math.floor(Math.abs(time) / 60);
  const seconds = Math.abs(time) % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { time, isRunning, start, stop, reset, formattedTime };
}
