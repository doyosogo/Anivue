import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates after the configured delay and clears old timers', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 350),
      {
        initialProps: { value: 'na' },
      },
    );

    rerender({ value: 'nar' });
    act(() => {
      vi.advanceTimersByTime(349);
    });
    expect(result.current).toBe('na');

    rerender({ value: 'naruto' });
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(result.current).toBe('naruto');
  });
});
