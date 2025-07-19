// Après retour success → poll status (webhook)

import { usePollTipStatus } from '../../hooks/usePollTipStatus';

export default function PaymentStatusWatcher({ tipId, onPaid }) {
  const { status, done, tries } = usePollTipStatus(tipId, true);

  if (status === 'paid') {
    onPaid?.();
    return null;
  }

  if (done && status !== 'paid') {
    return (
      <div className="text-center text-white/80 mt-8 text-sm">
        Confirmation en attente… (référence : {tipId.slice(-6)})
      </div>
    );
  }

  return (
    <div className="text-center text-white/80 mt-8 text-sm">
      Confirmation en cours… ({tries})
    </div>
  );
}
