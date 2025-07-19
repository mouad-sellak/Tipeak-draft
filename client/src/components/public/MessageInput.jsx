//Message optionnel (≤ 280 caractères)
export default function MessageInput({ value, onChange }) {
    return (
      <div className="bg-white/10 rounded-2xl p-5 mt-6 backdrop-blur-sm">
        <label className="text-white text-sm mb-2 block">
          Message (optionnel)
        </label>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value.slice(0, 280))}
          rows={3}
          placeholder="Merci !"
          className="w-full rounded-xl bg-white/15 text-white px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-white/40 placeholder-white/40"
        />
        <div className="text-right text-white/50 text-xs mt-1">
          {value.length}/280
        </div>
      </div>
    );
  }
  