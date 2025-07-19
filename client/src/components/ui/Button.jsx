// components/ui/Button.jsx
export default function Button({
    children,
    variant = 'primary',
    className = '',
    disabled,
    ...rest
  }) {
    const base = 'inline-flex items-center justify-center rounded-xl font-medium px-4 h-11 text-sm transition active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants = {
      primary: 'bg-brand-dark text-white hover:bg-brand shadow disabled:opacity-50',
      secondary: 'bg-white text-brand-dark border border-brand-dark hover:bg-brand/10 disabled:opacity-50',
      danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
      ghost: 'bg-transparent text-white hover:bg-white/10 disabled:opacity-50',
    };
    return (
      <button
        className={`${base} ${variants[variant] || variants.primary} ${className}`}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
  