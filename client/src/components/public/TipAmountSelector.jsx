// components/public/TipAmountSelector.jsx
// Sélecteur de montant (€)
// 3 boutons rapides + input libre
// (Option) gestion d'erreur
import { useState, useEffect } from 'react';
import { eurosToCents, centsToEuros } from '../../utils/money';

export default function TipAmountSelector({ quickAmounts = [], onAmountChange }) {
  const [selected, setSelected] = useState(null); // valeur € (number)
  const [custom, setCustom] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (selected != null) {
      onAmountChange(selected, eurosToCents(selected));
    } else if (custom !== '') {
      const cents = eurosToCents(custom);
      if (Number.isNaN(cents)) {
        setError('Montant invalide');
        onAmountChange(null, NaN);
      } else if (cents < 100) {
        setError('Min 1€');
        onAmountChange(null, cents);
      } else {
        setError('');
        onAmountChange(Number(custom), cents);
      }
    } else {
      onAmountChange(null, NaN);
    }
  }, [selected, custom, onAmountChange]);

  function handleQuick(v) {
    setSelected(v);
    setCustom('');
  }

  function handleCustom(e) {
    setSelected(null);
    setCustom(e.target.value);
  }

  return (
    <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
      <h2 className="text-white font-medium mb-4">Choisir le montant</h2>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {quickAmounts.map(v => (
          <button
            key={v}
            type="button"
            onClick={() => handleQuick(v)}
            className={`h-12 rounded-xl text-sm font-medium transition active:scale-95
              ${selected === v
                ? 'bg-white text-brand-dark shadow'
                : 'bg-white/15 text-white hover:bg-white/25'
              }`}
          >
            {v}€
          </button>
        ))}
      </div>
      <div className="mb-2">
        <label className="text-white/80 text-xs block mb-1">Montant libre (€)</label>
        <input
          value={custom}
            onChange={handleCustom}
          inputMode="decimal"
          placeholder="Ex: 4,50"
          className="w-full h-12 rounded-xl bg-white/15 text-white px-4 outline-none focus:ring-2 focus:ring-white/50 placeholder-white/40"
        />
      </div>
      <div className="text-center mt-4">
        <p className="text-white text-lg font-semibold">
          {(selected != null && `${selected.toFixed(2).replace('.', ',')}€`) ||
          (custom !== '' && !Number.isNaN(eurosToCents(custom)) && eurosToCents(custom) >= 100
            ? `${centsToEuros(eurosToCents(custom))}€`
            : '0€')}
        </p>
        {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
}
