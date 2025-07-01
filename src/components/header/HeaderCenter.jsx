export default function HeaderCenter() {
  return (
    <div className="header-center">
      <nav className="hidden md992:grid menu">
        <ul className="list-none">
          <li><a className='link-menu' href="">Inicio</a></li>
          <li><a className='link-menu' href="/productos">Productos</a></li>
          <li className="font-[Anton] uppercase italic text-[40px] mx-5"><a href="/">Nikos</a></li>
          <li><a className='link-menu' href="/#marcas">Marcas</a></li>
          <li><a className='link-menu' href="#contacto">Contacto</a></li>
        </ul>
      </nav>
    </div>
  );
}
