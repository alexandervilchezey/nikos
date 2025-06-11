import MegaSubMenu from './MegaSubMenu';

export default function HeaderCenter({ isBigSubmenuOpen, setIsBigSubMenuOpen }) {
  return (
    <div className="header-center">
      <nav className="hidden md992:grid menu">
        <ul className="list-none">
          <li><a className='link-menu' href="/">Inicio</a></li>
          <li>
            <a href="#" className="link-menu" onClick={(e) => { e.preventDefault(); setIsBigSubMenuOpen(!isBigSubmenuOpen); }}>
              Productos <i className='bx bx-caret-down'></i>
            </a>
            {isBigSubmenuOpen && <MegaSubMenu />}
          </li>
        </ul>
        <ul className="list-none">
          <li><a className='link-menu' href="/about">Nosotros</a></li>
          <li><a className='link-menu' href="/contact">Contacto</a></li>
        </ul>
      </nav>
      <div className='logoNikos'><a href="">Nikos</a></div>
    </div>
  );
}
