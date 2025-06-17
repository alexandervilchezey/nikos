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

  return (
    <ModalFiltros
      mostrarModalFiltros={isMobileMenuOpen}
      animatingClose={animatingClose}
      cerrarModalConAnimacion={cerrarModalConAnimacion}
    >
      <div className="main-menu scrollto">
        <nav className="wrapper">
          <ul className="pt-2">
            <li>
              <a className="block" href="/nikos">
                <span>Inicio</span>
              </a>
            </li>
            <li>
              <a className="block" href="/nikos/productos">
                <span>Productos</span>
              </a>
            </li>
            <li>
              <a className="block" href="/nikos/#marcas" onClick={() => setIsMobileMenuOpen(false)}>
                <span>Marcas</span>
              </a>
            </li>
            <li>
              <a className="block" href="#contacto" onClick={() => setIsMobileMenuOpen(false)}>
                <span>Contacto</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* MENÚ DE USUARIO */}
        {user && (
          <div className="border-t pt-4 px-4">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full text-left text-black font-medium mb-2"
            >
              Hola, {user.displayName || user.email}
            </button>

            {isUserMenuOpen && (
              <ul className="pl-2 text-sm text-gray-700 space-y-2">
                <li>
                  <button
                    onClick={() => {
                      navigate("/perfil");
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left"
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
                    className="block w-full text-left"
                  >
                    Mis compras
                  </button>
                </li>
                <li>
                  <button
                    onClick={async () => {
                      await signOut(auth);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-red-600"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}

        {/* BOTONES LOGIN/REGISTER */}
        {!user && (
          <div className="button mt-auto">
            <a href="/nikos/login" className="btn secondary-btn">
              Iniciar Sesión
            </a>
            <a href="/nikos/register" className="btn primary-btn">
              Registrarse
            </a>
          </div>
        )}
      </div>
    </ModalFiltros>
  );
}
