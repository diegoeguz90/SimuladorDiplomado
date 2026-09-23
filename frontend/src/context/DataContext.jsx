import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [seed, setSeed] = useState(42);
  const [years, setYears] = useState(2);
  const [numTiendas, setNumTiendas] = useState(5);
  const [modo, setModo] = useState('limpio');
  
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const cargarResumen = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getResumenDatos();
      setResumen(res.data);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('No se pudo conectar con el backend. Verifica que FastAPI esté corriendo en el puerto 8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarResumen();
  }, [refreshTrigger]);

  const regenerarDatos = async (customConfig = {}) => {
    const configFinal = {
      seed: customConfig.seed !== undefined ? customConfig.seed : seed,
      years: customConfig.years !== undefined ? customConfig.years : years,
      num_tiendas: customConfig.numTiendas !== undefined ? customConfig.numTiendas : numTiendas,
      modo: customConfig.modo !== undefined ? customConfig.modo : modo,
    };

    setLoading(true);
    try {
      await apiService.actualizarConfigDatos(configFinal);
      setSeed(configFinal.seed);
      setYears(configFinal.years);
      setNumTiendas(configFinal.num_tiendas);
      setModo(configFinal.modo);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error regenerando datos:', err);
      setError('Error al regenerar el universo de datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        seed,
        years,
        numTiendas,
        modo,
        resumen,
        loading,
        error,
        regenerarDatos,
        refreshTrigger,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
