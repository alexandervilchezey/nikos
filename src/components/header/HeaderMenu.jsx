import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useAuth } from '../auth/AuthProvider';

export default function HeaderUserMenu() {
  const { usuario } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setOpen(!open);

  const handleLogout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("usuario");
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!usuario) return null;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="cursor-pointer text-black font-medium hover:underline max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap"
      >
        Hola, {usuario.nombre + ' ' + usuario.apellido}
      </button>

      {open && (
        <div
          className={`absolute left-0 w-48 bg-white border border-gray-200 shadow-md z-50
            transition transform duration-200 ease-out origin-top scale-100 opacity-100
            animate-fade-in`}
        >
          {usuario.rol === 'admin' && (
            <button
              onClick={() => {
                setOpen(false);
                navigate('/admin/dashboard');
              }}
              className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
            >
              Panel de administración
            </button>
          )}
          <hr className="border-t border-gray-200" />
          <button
            onClick={() => {
              setOpen(false);
              navigate('/mi-perfil');
            }}
            className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
          >
            Ver perfil
          </button>
          <hr className="border-t border-gray-200" />
          <button
            onClick={() => {
              setOpen(false);
              navigate('/mis-compras');
            }}
            className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
          >
            Mis compras
          </button>
          <hr className="border-t border-gray-200" />
          <button
            onClick={handleLogout}
            className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
