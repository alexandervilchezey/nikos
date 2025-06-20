import { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
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
    const obtenerProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
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
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 992px)');
    const handleResize = (e) => {
      if (e.matches) {
        setIsMobileMenuOpen(false);
      }
    };
    mediaQuery.addListener(handleResize);
    return () => mediaQuery.removeListener(handleResize);
  }, []);

  return (
    <div id="page" className="page-home">
      <header className={isMobileMenuOpen ? 'mobile-version' : ''}>
        <div className="inner-header">
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
