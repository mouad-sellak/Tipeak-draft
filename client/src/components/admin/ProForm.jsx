// components/admin/ProForm.jsx
import { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import Button from '../ui/Button';

/**
 * Formulaire création / édition d'un pro.
 * - Montants rapides saisis sous forme "2,5,10" => array [2,5,10]
 */
export default function ProForm({ onSubmit, loading, initial }) {
  const [name, setName] = useState(initial?.name || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [amounts, setAmounts] = useState(
    initial?.quickAmounts?.join(',') || '2,5,10'
  );
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [name, email, slug, amounts]);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Nom requis';
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) e.email = 'Email invalide';
    if (slug && !slug.match(/^[a-z0-9-]+$/)) e.slug = 'Slug: a-z0-9- uniquement';
    if (!amounts.trim()) e.amounts = 'Montants requis';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const eMap = validate();
    if (Object.keys(eMap).length) {
      setErrors(eMap);
      return;
    }
    const quickAmounts = amounts
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter(n => !Number.isNaN(n) && n > 0);

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      slug: slug.trim() || undefined,
      quickAmounts,
      avatarUrl: avatarUrl.trim() || undefined,
      role: 'pro',
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 rounded-2xl p-6">
      <h2 className="text-white font-semibold mb-4 text-lg">
        {initial ? 'Modifier' : 'Nouveau professionnel'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nom" value={name} onChange={e=>setName(e.target.value)} error={errors.name} />
        <Input label="Email" value={email} onChange={e=>setEmail(e.target.value)} error={errors.email} />
        <Input label="Slug (optionnel)" value={slug} onChange={e=>setSlug(e.target.value)} error={errors.slug} />
        <Input label="Avatar URL (optionnel)" value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} />
        <Input label="Montants rapides (ex: 2,5,10)" value={amounts} onChange={e=>setAmounts(e.target.value)} error={errors.amounts} />
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Envoi...' : initial ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}
