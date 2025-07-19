// components/admin/ProsTable.jsx
import Button from '../ui/Button';
import { Spinner } from '../ui/Spinner';

export default function ProsTable({ pros, loading, onToggleActive, onShowQr, onEdit }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size={40} />
      </div>
    );
  }
  if (!pros.length) {
    return <div className="text-white/70 text-sm py-6">Aucun professionnel.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm text-white/90">
        <thead className="bg-white/10 text-left">
          <tr>
            <th className="px-4 py-3">Nom</th>
            <th className="px-4 py-3">Slug</th>
            <th className="px-4 py-3">Montants</th>
            <th className="px-4 py-3">Actif</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pros.map(p => (
            <tr key={p._id} className="border-t border-white/10">
              <td className="px-4 py-3 font-medium">{p.name}</td>
              <td className="px-4 py-3">{p.slug}</td>
              <td className="px-4 py-3">
                {Array.isArray(p.quickAmounts)
                  ? p.quickAmounts.map(a => `${a}€`).join(', ')
                  : ''}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-block px-2 py-0.5 rounded text-xs
                  ${p.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                  {p.isActive ? 'Oui' : 'Non'}
                </span>
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <Button variant="ghost" onClick={() => onShowQr(p._id)}>QR</Button>
                <Button
                  variant="ghost"
                  onClick={() => onToggleActive(p)}
                >
                  {p.isActive ? 'Désactiver' : 'Activer'}
                </Button>
                <Button variant="ghost" onClick={() => onEdit(p)}>Éditer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
