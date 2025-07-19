// pages/admin/AdminProsPage.jsx
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { usePros } from '../../hooks/usePros';
import PageHeader from '../../components/admin/PageHeader';
import ProsTable from '../../components/admin/ProsTable';
import ProForm from '../../components/admin/ProForm';
import QRModal from '../../components/admin/QRModal';
import Button from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { useState } from 'react';

export default function AdminProsPage() {
  const { user, logout } = useAdminAuth();
  const {
    pros,
    loading,
    error,
    creating,
    updating,
    addPro,
    patchPro,
    openQr,
    closeQr,
    qrDataUrl,
    selectedPro,
  } = usePros();

  const [editing, setEditing] = useState(null); // pro en édition

  const handleCreate = (payload) => {
    addPro(payload);
  };

  const handleUpdate = (payload) => {
    patchPro(editing._id, payload).then(() => setEditing(null));
  };

  const handleToggleActive = (pro) => {
    patchPro(pro._id, { isActive: !pro.isActive });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Professionnels"
          onLogout={logout}
        >
          <span className="text-white/70 text-sm">
            Connecté : <strong>{user?.name}</strong>
          </span>
        </PageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
            <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Liste</h2>
              <Button variant="secondary" onClick={()=>setEditing(null)}>
                Nouveau
              </Button>
            </div>
            <ProsTable
              pros={pros}
              loading={loading}
              onToggleActive={handleToggleActive}
              onShowQr={openQr}
              onEdit={(p)=>setEditing(p)}
            />
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-1 space-y-6">
            <ProForm
              onSubmit={editing ? handleUpdate : handleCreate}
              loading={creating || updating}
              initial={editing}
            />
            {editing && (
              <Button
                variant="ghost"
                className="w-full"
                onClick={()=>setEditing(null)}
              >
                Annuler édition
              </Button>
            )}
          </div>
        </div>
      </div>

      <QRModal
        open={!!qrDataUrl}
        onClose={closeQr}
        qrDataUrl={qrDataUrl}
        pro={selectedPro}
      />

      <Toast
        message={error}
        type="error"
        onClose={()=>{/* ignore pour MVP (ou reset via hook) */}}
      />
    </div>
  );
}
