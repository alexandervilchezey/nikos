import { useState, useEffect } from 'react';
import HeaderLeft from './header/HeaderLeft';
import HeaderCenter from './header/HeaderCenter';
import HeaderRight from './header/HeaderRight';
import SearchFloat from './header/SearchFloat';
import Overlay from './header/Overlay';
import MobileMenu from './header/MobileMenu';

export default function Header() {
  const [isBigSubmenuOpen, setIsBigSubMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubmenuOpen, setIsSubMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 992px)');
    const handleResize = (e) => {
      if (e.matches) {
        setIsMobileMenuOpen(false);
        setIsBigSubMenuOpen(false);
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
              <HeaderCenter
                isBigSubmenuOpen={isBigSubmenuOpen}
                setIsBigSubMenuOpen={setIsBigSubMenuOpen}
              />
              <HeaderRight setIsSearchOpen={setIsSearchOpen} />
            </div>
          </div>
          <SearchFloat isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
        </div>
      </header>
      <Overlay isActive={isSearchOpen || isMobileMenuOpen} />
      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSubmenuOpen={isSubmenuOpen}
        setIsSubMenuOpen={setIsSubMenuOpen}
      />
    </div>
  );
}
