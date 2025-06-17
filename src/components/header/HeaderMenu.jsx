import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useAuth } from '../../hooks/useAuth';

export default function HeaderUserMenu() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setOpen(!open);

  const handleLogout = async () => {
    await signOut(auth);
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

  if (!user) return null;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="text-black font-medium hover:underline"
      >
        Hola, {user.displayName || user.email}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          <button
            onClick={() => {
              setOpen(false);
              navigate('/perfil');
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Ver perfil
          </button>
          <button
            onClick={() => {
              setOpen(false);
              navigate('/mis-compras');
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Mis compras
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
