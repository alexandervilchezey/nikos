// import MegaSubMenu from './MegaSubMenu';

// { isBigSubmenuOpen, setIsBigSubMenuOpen }
export default function HeaderCenter() {
  return (
    <div className="header-center">
      <nav className="hidden md992:grid menu">
        <ul className="list-none">
          <li><a className='link-menu' href="/nikos">Inicio</a></li>
          <li><a className='link-menu' href="/nikos/productos">Productos</a></li>
          {/* <li>
            <a href="#" className="link-menu" onClick={(e) => { e.preventDefault(); setIsBigSubMenuOpen(!isBigSubmenuOpen); }}>
              Productos <i className='bx bx-caret-down'></i>
            </a>
            {isBigSubmenuOpen && <MegaSubMenu onClose={() => {setIsBigSubMenuOpen(false); }}/>}
          </li> */}
        </ul>
        <ul className="list-none">
          <li><a className='link-menu' href="/nikos/#marcas">Marcas</a></li>
          <li><a className='link-menu' href="#contacto">Contacto</a></li>
        </ul>
      </nav>
      <div className='flex pointer-events-none items-center justify-center font-[Anton] uppercase italic text-[40px] absolute top-0 right-0 left-0'><a href="">Nikos</a></div>
    </div>
  );
}
