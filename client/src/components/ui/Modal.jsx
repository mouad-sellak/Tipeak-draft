// components/ui/Modal.jsx
export function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-md bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] rounded-2xl p-6 shadow-xl text-white">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  }
  