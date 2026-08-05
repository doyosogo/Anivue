import { useEffect, useState } from 'react';

export function useDebouncedValue<TValue>(
  value: TValue,
  delayMs: number,
): TValue {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [delayMs, value]);

  return debouncedValue;
}
