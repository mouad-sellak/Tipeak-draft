// components/ui/Toast.jsx
export function Toast({ message, type='error', onClose }) {
    if (!message) return null;
    const colors = type === 'error'
      ? 'bg-red-600'
      : type === 'success'
        ? 'bg-emerald-600'
        : 'bg-brand-dark';
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className={`${colors} text-white px-4 py-3 rounded-xl shadow flex items-center gap-3`}>
          <span className="text-sm">{message}</span>
          <button onClick={onClose} className="font-bold">×</button>
        </div>
      </div>
    );
  }
  