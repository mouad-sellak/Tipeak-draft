// components/ui/Spinner.jsx
export function Spinner({ size = 20, className='' }) {
    return (
      <div
        className={`inline-block animate-spin rounded-full border-2 border-white/30 border-t-white ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  