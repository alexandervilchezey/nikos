import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function PrivateRoute({ children, rolRequerido }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div className="p-6">Cargando...</div>;

  if (!usuario || usuario.rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  return children;
}
