import { useState, useCallback, useEffect } from 'react';

export const useAsync = (asyncFunction: any, immediate: boolean = true) => {
  const [pending, setPending] = useState<boolean>(false);
  const [value, setValue] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    setPending(true);
    setValue(null);
    setError(null);
    return asyncFunction()
      .then((response: any) => setValue(response))
      .catch((error: any) => setError(error))
      .finally(() => setPending(false));
  }, [asyncFunction]);

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, pending, value, error };
};