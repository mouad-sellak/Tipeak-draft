import { useParams, useLocation } from 'react-router-dom';
import { useState, useCallback, useMemo } from 'react';
import { usePublicPro } from '../hooks/usePublicPro';
import { useCheckoutTip } from '../hooks/useCheckoutTip';
import ProHeader from '../components/public/ProHeader';
import TipAmountSelector from '../components/public/TipAmountSelector';
import MessageInput from '../components/public/MessageInput';
import PayPanel from '../components/public/PayPanel';
import SuccessPanel from '../components/public/SuccessPanel';
import ErrorBanner from '../components/public/ErrorBanner';
import PaymentStatusWatcher from '../components/public/PaymentStatusWatcher';
import LoadingSkeleton from '../components/public/LoadingSkeleton';
import logo from '../assets/logo.svg';

export default function ProTipPage() {
  const { slug } = useParams();
  const location = useLocation();

  // Query params
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const success = query.get('success') === 'true';
  const tipId = query.get('tipId');

  const { data: pro, loading, error: loadError } = usePublicPro(slug);
  const { createCheckout, loading: checkoutLoading, error: checkoutError, setError: setCheckoutError } = useCheckoutTip();

  const [amountEuro, setAmountEuro] = useState(null);
  const [amountCents, setAmountCents] = useState(NaN);
  const [message, setMessage] = useState('');
  const [paid, setPaid] = useState(false);

  const onAmountChange = useCallback((eurosVal, centsVal) => {
    setAmountEuro(eurosVal);
    setAmountCents(centsVal);
  }, []);

  async function handlePay() {
    if (amountEuro == null || amountEuro < 1) return;
    const res = await createCheckout({ slug, amountEuro, message });
    if (res?.sessionUrl) {
      window.location.href = res.sessionUrl;
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-5 py-8 bg-gradient-to-br from-[#8B5CF6] via-[#7361F4] to-[#3B82F6] font-sans">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-4 flex items-center gap-2">
          <img src={logo} alt="Tipeak" className="h-8 w-8" />
          <span className="text-white font-semibold text-lg">Tipeak</span>
        </div>

        {loading && <LoadingSkeleton />}

        {!loading && loadError && (
          <div className="text-white/90 text-center">
            Cette page de pourboire n’existe pas.
          </div>
        )}

        {!loading && pro && !success && (
          <>
            <ProHeader name={pro.name} avatarUrl={pro.avatarUrl} subtitle={pro.slug} />
            <TipAmountSelector
              quickAmounts={pro.quickAmounts}
              onAmountChange={onAmountChange}
            />
            <MessageInput value={message} onChange={setMessage} />
            <ErrorBanner message={checkoutError} onClose={() => setCheckoutError(null)} />
            <PayPanel
              amountEuro={amountEuro}
              onPay={handlePay}
              loading={checkoutLoading}
              disabled={Number.isNaN(amountCents) || amountCents < 100}
            />
          </>
        )}

        {/* Retour de Stripe (success) */}
        {!loading && pro && success && (
          <>
            {!paid && tipId && (
              <PaymentStatusWatcher tipId={tipId} onPaid={() => setPaid(true)} />
            )}
            {paid && <SuccessPanel amountCents={amountCents || 0} />}
            {!paid && !tipId && (
              <div className="text-white/80 text-center mt-10">
                Référence paiement introuvable.
              </div>
            )}
          </>
        )}
      </div>
      <footer className="mt-auto mb-4 text-white/40 text-xs">
        © {new Date().getFullYear()} Tipeak
      </footer>
    </div>
  );
}
