import {
  useCallback,
  useEffect,
  useState,
} from 'react';

export default function useAsyncEffect(fn, deps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const cb = useCallback(fn, deps);

  useEffect(() => {
    let isValid = true;
    setIsProcessing(true);

    const run = async () => {
      await cb(() => isValid);
      setIsProcessing(false);
    };

    run();
    return () => {
      isValid = false;
    };
  }, [cb, setIsProcessing]);

  return [isProcessing];
}
