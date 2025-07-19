// Gère état loading + erreur centralisée → réutilisable plus tard (refactor F10 si besoin d’autres flux).

import { useState } from 'react';

export function useCheckoutTip() {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  async function createCheckout({ slug, amountEuro, message }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tips/checkout', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ slug, amount: amountEuro, message }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(()=>({}));
        throw new Error(errJson?.error?.message || res.statusText);
      }
      return await res.json();
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createCheckout, loading, error, setError };
}
