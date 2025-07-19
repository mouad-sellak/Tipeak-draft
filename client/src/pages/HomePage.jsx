// pages/HomePage.jsx
export default function HomePage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8B5CF6] via-[#7361F4] to-[#3B82F6] text-white font-sans px-6">
        <div className="text-center max-w-xs">
          <div className="w-32 h-32 mx-auto rounded-2xl bg-white/15 flex items-center justify-center mb-8 text-5xl">
            📷
          </div>
          <h1 className="text-2xl font-semibold mb-2">Scanner le QR Code</h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Pointez votre caméra vers le code pour laisser un pourboire sécurisé.
          </p>
        </div>
      </div>
    );
  }
  