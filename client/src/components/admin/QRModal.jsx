// components/admin/QRModal.jsx
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';

export default function QRModal({ open, onClose, qrDataUrl, pro }) {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qr-${pro?.slug || 'pro'}.png`;
    a.click();
  };

  return (
    <Modal open={open} onClose={onClose} title={`QR Code ${pro?.name || ''}`}>
      {!qrDataUrl && (
        <div className="text-white/70 text-sm">Chargement...</div>
      )}
      {qrDataUrl && (
        <div className="flex flex-col items-center">
          <img
            src={qrDataUrl}
            alt="QR Code"
            className="w-56 h-56 bg-white p-3 rounded-xl"
          />
          <Button className="mt-4" onClick={handleDownload}>
            Télécharger PNG
          </Button>
        </div>
      )}
    </Modal>
  );
}
