import { Routes, Route, Navigate } from 'react-router-dom';
import VehiculosPage from './pages/Vehiculo';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vehiculos" replace />} />
      <Route path="/vehiculos" element={<VehiculosPage />} />
      <Route path="*" element={<Navigate to="/vehiculos" replace />} />
    </Routes>
  );
}