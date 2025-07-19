// components/public/ProHeader.jsx
// Afficher identité professionnelle (avatar, nom, slug)
export default function ProHeader({ name, avatarUrl, subtitle }) {
    return (
      <div className="text-center mb-6">
        <div className="mx-auto w-24 h-24 rounded-full bg-white/10 flex items-center justify-center overflow-hidden mb-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">👤</span>
          )}
        </div>
        <h1 className="text-white font-semibold text-xl">{name}</h1>
        {subtitle && (
          <p className="text-white/80 text-sm mt-1">{subtitle}</p>
        )}
        {/* (Option) rating */}
        {/* <div className="flex items-center justify-center gap-1 mt-2">
          <span className="text-yellow-300 text-lg">★ ★ ★ ★ ★</span>
          <span className="text-white/70 text-xs">4.9</span>
        </div> */}
      </div>
    );
  }
  