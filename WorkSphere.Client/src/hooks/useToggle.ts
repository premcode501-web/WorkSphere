import { useState, useCallback } from 'react';

export const useToggle = (initial = false) => {
  const [state, setState] = useState<boolean>(initial);
  const toggle = useCallback(() => setState(s => !s), []);
  return { state, setState, toggle } as const;
};
