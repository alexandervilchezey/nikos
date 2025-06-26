import { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import HeaderLeft from '../header/HeaderLeft';
import HeaderCenter from '../header/HeaderCenter';
import HeaderRight from '../header/HeaderRight';
import SearchFloat from '../header/SearchFloat';
import MobileMenu from '../header/MobileMenu';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubmenuOpen, setIsSubMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const obtenerProductos = async () => {
      try {
        const q = query(collection(db, "productos"), limit(20)); // <-- Evita cargar demasiado
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    obtenerProductos();
  }, [isSearchOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 992px)');
    const handleResize = (e) => {
      if (e.matches) {
        setIsMobileMenuOpen(false);
      }
    };
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return (
    <div id="page" className={`${isMobileMenuOpen ? 'mobile-version' : ''}`}>
      <header>
        <div className="inner-header leading-[80px]">
          <div className="wide">
            <div className="wrap">
              <HeaderLeft setIsMobileMenuOpen={setIsMobileMenuOpen} />
              <HeaderCenter />
              <HeaderRight setIsSearchOpen={setIsSearchOpen} />
            </div>
          </div>
          <SearchFloat
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            productos={productos}
          />
        </div>
      </header>
      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSubmenuOpen={isSubmenuOpen}
        setIsSubMenuOpen={setIsSubMenuOpen}
      />
    </div>
  );
}
