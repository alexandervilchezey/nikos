import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductosPage from './pages/ProductosPage';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailConfirmation from './pages/EmailConfirmation';
import FirebaseRedirector from './firebase/FirebaseRedirector';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PerfilUsuario from './pages/PerfilUsuario';
import ComprasUsuario from './pages/ComprasUsuario';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ProductosAdmin from './admin/ProductosAdmin';
import FiltrosAdmin from './admin/FiltrosAdmin';
import VentasAdmin from './admin/VentasAdmin';

function App() {

  return (
    <div className="relative" style={{ minHeight: '100dvh' }}>
      <Routes>
        {/* 🔁 Manejo automático de los enlaces de Firebase */}
        <Route path="/redirect" element={<FirebaseRedirector />} />

        {/* 🔐 Autenticación y recuperación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/confirmar" element={<EmailConfirmation />} />

        {/* 🏠 Rutas dentro del layout */}
        <Route path="/*" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="productos/:slug" element={<Products />} />
          <Route path="checkout" element={<Checkout />} />
          <Route
            path="mi-perfil"
            element={
              <ProtectedRoute>
                <PerfilUsuario />
              </ProtectedRoute>
            }
          />
          <Route
            path="mis-compras"
            element={
              <ProtectedRoute>
                <ComprasUsuario />
              </ProtectedRoute>
            }
          />
        </Route>

         {/* 🏠 Rutas del Admin page */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="productos" element={<ProductosAdmin />} />
          <Route path="filtros" element={<FiltrosAdmin />} />
          <Route path="ventas" element={<VentasAdmin />} />
        </Route>
          
      </Routes>
    </div>
  );
}

export default App;
