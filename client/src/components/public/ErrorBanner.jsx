export default function ErrorBanner({ message, onClose }) {
    if (!message) return null;
    return (
      <div className="mt-4 bg-red-500/90 text-white text-sm px-4 py-3 rounded-xl flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 font-bold">×</button>
      </div>
    );
  }
  