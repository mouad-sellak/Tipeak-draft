
// Afficher écran remerciement

import { centsToEuros } from '../../utils/money';

export default function SuccessPanel({ amountCents }) {
  return (
    <div className="text-center mt-10 animate-fade-in">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-white text-2xl font-bold mb-2">Merci !</h2>
      <p className="text-white/80 mb-4">
        Votre pourboire de {centsToEuros(amountCents)}€ a été envoyé.
      </p>
      <div className="bg-white/15 rounded-xl px-4 py-3 text-white/70 text-sm">
        Le professionnel a bien reçu votre soutien.
      </div>
    </div>
  );
}
