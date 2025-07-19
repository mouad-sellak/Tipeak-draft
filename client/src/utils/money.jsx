// Convertit un nombre euros (string/number) en centimes (int) ou NaN
// Centralise pour éviter arrondis incohérents (empêche duplications).
export function eurosToCents(val) {
    if (val === '' || val === null || val === undefined) return NaN;
    const normalized = String(val).replace(',', '.').trim();
    const n = Number(normalized);
    if (Number.isNaN(n)) return NaN;
    return Math.round(n * 100);
  }
  
  export function centsToEuros(c) {
    if (typeof c !== 'number') return '';
    return (c / 100).toFixed(2).replace('.', ',');
  }
  