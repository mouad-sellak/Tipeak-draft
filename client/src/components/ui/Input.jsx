// components/ui/Input.jsx
export function Input({ label, error, className='', ...rest }) {
    return (
      <label className="block text-sm mb-4">
        <span className="block mb-1 font-medium text-white/90">{label}</span>
        <input
          className={`w-full h-11 px-4 rounded-xl bg-white/15 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/50 ${className}`}
          {...rest}
        />
        {error && <span className="text-xs text-red-300 mt-1">{error}</span>}
      </label>
    );
  }
  