//Lancer paiement → redirection Stripe

export default function PayPanel({ amountEuro, onPay, loading, disabled }) {
    if (amountEuro == null || Number.isNaN(amountEuro) || amountEuro < 1) {
      return (
        <div className="mt-6 text-center text-white/60 text-sm">
          Sélectionnez (ou saisissez) un montant.
        </div>
      );
    }
    return (
      <div className="mt-6 space-y-4">
        <button
          onClick={onPay}
          disabled={loading || disabled}
          className={`w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2
            ${disabled || loading
              ? 'bg-white/20 text-white/60 cursor-not-allowed'
              : 'bg-black text-white hover:bg-black/90 active:scale-95 transition'}`
          }
        >
          {loading ? 'Redirection...' : `Payer ${amountEuro.toFixed(2).replace('.', ',')}€`}
        </button>
  
        {/* Payer par carte (option si tu implémentes PaymentRequest plus tard) */}
        {/* <button ...>Payer par carte</button> */}
  
        <div className="text-center text-white/60 text-xs">
          ❤️ Paiement 100% sécurisé
        </div>
      </div>
    );
  }
  