import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleSelection from '../pages/RoleSelection';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Vehicles from '../pages/Vehicles';
import Drivers from '../pages/Drivers';
import Trips from '../pages/Trips';
import Maintenance from '../pages/Maintenance';
import Finance from '../pages/Finance';
import Reports from '../pages/Reports';
import { PERMISSIONS } from '../constants/permissions';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login/:roleId" element={<Login />} />
      
      {/* Protected Routes wrapped in Layout */}
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={PERMISSIONS.DASHBOARD}><Dashboard /></ProtectedRoute>} />
        
        {/* Fleet Manager / Safety Shared */}
        <Route path="/vehicles" element={<ProtectedRoute allowedRoles={PERMISSIONS.VEHICLES}><Vehicles /></ProtectedRoute>} />
        <Route path="/drivers" element={<ProtectedRoute allowedRoles={PERMISSIONS.DRIVERS}><Drivers /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute allowedRoles={PERMISSIONS.TRIPS}><Trips /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute allowedRoles={PERMISSIONS.MAINTENANCE}><Maintenance /></ProtectedRoute>} />
        
        {/* Finance / Analyst */}
        <Route path="/finance" element={<ProtectedRoute allowedRoles={PERMISSIONS.FINANCE}><Finance /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute allowedRoles={PERMISSIONS.REPORTS}><Reports /></ProtectedRoute>} />
        
        {/* Other Driver/Safety/Analyst Specific Placeholders could go here */}
      </Route>
    </Routes>
  );
}
