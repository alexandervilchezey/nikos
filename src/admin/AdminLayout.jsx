import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
      else setUsuario(user);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar */}
      <aside className={`z-10 flex flex-col bg-black text-white p-4 ${isCollapsed ? 'w-16' : 'w-64 absolute md:relative h-full'} transition-all duration-300`}>
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <div className='flex items-center justify-center font-[Anton] uppercase italic text-[40px]'>Nikos</div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white text-lg focus:outline-none"
          >
            <i className='bx bx-menu'></i>
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-4 text-sm">
          <Link to="/admin/dashboard" className="hover:text-gray-300 flex items-center gap-2 text-lg">
            <i className="bx bx-dashboard text-lg"></i>
            {!isCollapsed && 'Dashboard'}
          </Link>
          <Link to="/admin/filtros" className="hover:text-gray-300 flex items-center gap-2 text-lg">
            <i className='bx bx-menu-filter text-lg'></i> 
            {!isCollapsed && 'Filtros'}
          </Link>
          <Link to="/admin/productos" className="hover:text-gray-300 flex items-center gap-2 text-lg">
            <i className="bx bx-box text-lg"></i>
            {!isCollapsed && 'Productos'}
          </Link>
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white hover:text-gray-300 text-lg"
          >
            <i className="bx bx-door-open text-lg"></i>
            {!isCollapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        {/* Topbar */}
        <header className="flex justify-between items-center mb-6 border-b pb-2">
          <h1 className="text-lg font-bold whitespace-nowrap">Hola {usuario?.displayName || 'Admin'}</h1>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
