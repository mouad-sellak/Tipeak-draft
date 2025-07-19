// components/admin/LoginForm.jsx
import { useState } from 'react';
import Button from '../ui/Button';
import { Input } from '../ui/Input';

export default function LoginForm({ onSubmit, loading, error }) {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('Admin123!');

  const handle = (e) => {
    e.preventDefault();
    onSubmit(email.trim(), password);
  };

  return (
    <form
      onSubmit={handle}
      className="bg-white/10 backdrop-blur-md p-8 rounded-2xl w-full max-w-sm shadow-card"
    >
      <h1 className="text-2xl font-semibold text-white mb-6 text-center">Admin – Connexion</h1>

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
        placeholder="admin@demo.com"
      />
      <Input
        label="Mot de passe"
        type="password"
        value={password}
        onChange={e=>setPassword(e.target.value)}
        placeholder="••••••••"
      />

      {error && <div className="text-red-300 text-sm mb-3">{error}</div>}

      <Button className="w-full" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </Button>
      <p className="mt-4 text-center text-white/50 text-xs">
        Accès réservé administrateur.
      </p>
    </form>
  );
}
