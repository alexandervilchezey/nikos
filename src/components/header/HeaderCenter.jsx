// import MegaSubMenu from './MegaSubMenu';

// { isBigSubmenuOpen, setIsBigSubMenuOpen }
export default function HeaderCenter() {
  return (
    <div className="header-center">
      <nav className="hidden md992:grid menu">
        <ul className="list-none">
          <li><a className='link-menu' href="/">Inicio</a></li>
          <li><a className='link-menu' href="/productos">Productos</a></li>
          {/* <li>
            <a href="#" className="link-menu" onClick={(e) => { e.preventDefault(); setIsBigSubMenuOpen(!isBigSubmenuOpen); }}>
              Productos <i className='bx bx-caret-down'></i>
            </a>
            {isBigSubmenuOpen && <MegaSubMenu onClose={() => {setIsBigSubMenuOpen(false); }}/>}
          </li> */}
        </ul>
        <ul className="list-none">
          <li><a className='link-menu' href="/#marcas">Marcas</a></li>
          <li><a className='link-menu' href="#contacto">Contacto</a></li>
        </ul>
      </nav>
      <div className='logoNikos'><a href="">Nikos</a></div>
    </div>
  );
}
