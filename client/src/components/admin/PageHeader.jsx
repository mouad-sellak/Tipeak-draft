// components/admin/PageHeader.jsx
import Button from '../ui/Button';

export default function PageHeader({ title, onLogout, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-white text-2xl font-semibold">{title}</h1>
        <p className="text-white/60 text-sm mt-1">Gestion des professionnels.</p>
      </div>
      <div className="flex items-center gap-3">
        {children}
        <Button variant="secondary" onClick={onLogout}>Déconnexion</Button>
      </div>
    </div>
  );
}
