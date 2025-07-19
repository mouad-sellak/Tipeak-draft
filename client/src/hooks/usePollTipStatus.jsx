// Abstraction du polling (interval & stop conditions) ⇒ isoler complexité.
import { useEffect, useState } from 'react';

export function usePollTipStatus(tipId, enabled = false, intervalMs = 2000, maxTries = 15) {
  const [status, setStatus] = useState(null);
  const [done, setDone] = useState(false);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (!enabled || !tipId) return;
    let cancelled = false;
    let timer;

    const poll = async () => {
      setTries(t => t + 1);
      try {
        const r = await fetch(`/api/tips/status/${tipId}`);
        if (!r.ok) throw new Error();
        const json = await r.json();
        setStatus(json.status);
        if (json.status === 'paid') {
          setDone(true);
          return;
        }
      } catch {
        // ignore soft
      }
      if (!cancelled && tries + 1 < maxTries) {
        timer = setTimeout(poll, intervalMs);
      } else {
        setDone(true); // stop (timeout)
      }
    };

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipId, enabled]);

  return { status, done, tries };
}
