import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProTipPage from './pages/ProTipPage';
import HomePage from './pages/HomePage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:slug" element={<ProTipPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<div className="text-center p-8 text-gray-600">Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}
