// client/src/App.jsx
// ------------------------------------------------------
// Placeholder App pour F00.
// Vérifie que Tailwind fonctionne et que la connexion API
// /api/health répond.
// ------------------------------------------------------

import { useEffect, useState } from 'react';

function App() {
  const [apiStatus, setApiStatus] = useState('...');
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    // Appel simple à /api/health (proxy via Vite config qu'on ajoutera)
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        setApiStatus(data?.status || 'unknown');
        setTimestamp(data?.timestamp);
      })
      .catch(() => setApiStatus('erreur'));
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Tip MVP – F00 OK ✅</h1>
      <p className="mb-2 text-sm text-gray-600">
        Ceci est l’interface React de test.
      </p>
      <div className="mt-6 p-4 border rounded bg-white shadow-sm">
        <p>Statut API : <strong>{apiStatus}</strong></p>
        {timestamp && (
          <p className="text-xs text-gray-500 mt-1">
            Dernier ping : {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
