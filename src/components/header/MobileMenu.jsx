import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import ModalFiltros from "../reusable/ModalFiltros";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../hooks/useAuth";

export default function MobileMenu({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const [animatingClose, setAnimatingClose] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const cerrarModalConAnimacion = () => {
    setAnimatingClose(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setAnimatingClose(false);
    }, 400);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("usuario");
      sessionStorage.removeItem("usuario");
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <ModalFiltros
      mostrarModalFiltros={isMobileMenuOpen}
      animatingClose={animatingClose}
      cerrarModalConAnimacion={cerrarModalConAnimacion}
    >
      <div className="main-menu scrollto flex flex-col h-full">
        <nav className="wrapper">
          <ul className="pt-2 space-y-2">
            <li>
              <a className="block px-4 text-black" href="">Inicio</a>
            </li>
            <li>
              <a className="block px-4 text-black" href="/productos">Productos</a>
            </li>
            <li>
              <a
                className="block px-4 text-black"
                href="/#marcas"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marcas
              </a>
            </li>
            <li>
              <a
                className="block px-4 text-black"
                href="#contacto"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contacto
              </a>
            </li>
          </ul>
        </nav>

        {/* Login/Register para visitantes */}
        {!user && (
          <div className="mt-auto p-4 flex flex-col space-y-2 gap-2">
            <a href="/login" className="btn secondary-btn text-center bg-black text-white py-2 rounded">Iniciar Sesión</a>
            <a href="/register" className="btn primary-btn text-center border border-black py-2 text-black rounded">Registrarse</a>
          </div>
        )}

        {/* Menú de usuario */}
        {user && (
          <div className="mt-auto border-t border-gray-200 px-4 pt-4">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex justify-between items-center text-black font-medium text-left truncate"
            >
              <span className="truncate max-w-[80%]" title={user.displayName || user.email}>
                Hola, {user.displayName || user.email}
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <ul
              className={`mt-3 space-y-2 text-sm text-gray-800 overflow-hidden transition-all duration-300 ${
                isUserMenuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <li>
                <button
                  onClick={() => {
                    navigate("/mi-perfil");
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
                >
                  Ver perfil
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate("/mis-compras");
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
                >
                  Mis compras
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 hover:bg-gray-100 px-2 py-1 rounded"
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </ModalFiltros>
  );
}
