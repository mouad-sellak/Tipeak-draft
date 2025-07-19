// hooks/usePros.js
import { useEffect, useState, useCallback } from 'react';
import { listPros, createPro, updatePro, getProQr } from '../api/adminApi';

export function usePros() {
  const [pros, setPros] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [selectedPro, setSelectedPro] = useState(null);

  const fetchPros = useCallback(async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPros({ page: p, limit });
      // Suppose qu'API renvoie { items:[], totalItems, ... } ou direct liste
      const rows = data.items || data; 
      setPros(rows);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => { fetchPros(1); }, [fetchPros]);

  const addPro = useCallback(async (payload) => {
    setCreating(true);
    setError(null);
    try {
      await createPro(payload);
      await fetchPros(1);
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  }, [fetchPros]);

  const patchPro = useCallback(async (id, payload) => {
    setUpdating(true);
    setError(null);
    try {
      await updatePro(id, payload);
      await fetchPros();
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdating(false);
    }
  }, [fetchPros]);

  const openQr = useCallback(async (id) => {
    setError(null);
    setQrDataUrl(null);
    try {
      const data = await getProQr(id);
      setQrDataUrl(data.qrDataUrl);
      const pro = pros.find(p => p._id === id);
      setSelectedPro(pro || null);
    } catch (e) {
      setError(e.message);
    }
  }, [pros]);

  const closeQr = () => {
    setQrDataUrl(null);
    setSelectedPro(null);
  };

  return {
    pros,
    page,
    limit,
    loading,
    error,
    creating,
    updating,
    addPro,
    patchPro,
    fetchPros,
    openQr,
    closeQr,
    qrDataUrl,
    selectedPro,
  };
}
