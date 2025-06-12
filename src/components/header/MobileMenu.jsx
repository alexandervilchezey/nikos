import { tipoCalzado, usuarioGeneral, marcasZapatos } from "../../utils/dataGeneral";

export default function MobileMenu({ isMobileMenuOpen, setIsMobileMenuOpen, isSubmenuOpen, setIsSubMenuOpen }) {
  const marcasDestacadas = marcasZapatos.slice(0, 5);
  const tiposDestacados = tipoCalzado.slice(0, 4);
  const usuariosDestacados = usuarioGeneral.slice(0, 4);
  
  return (
    <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
      <div className="wrap">
        <a href="#" className='close-trigger right-0' onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}>
          <i className='bx bx-x'></i>
        </a>
        <div className="main-menu scrollto">
          <nav className='wrapper'>
            <ul>
              <li><a href=""><span>Inicio</span></a></li>
              <li className='has-child'>
                <a href="#" onClick={(e) => { e.preventDefault(); setIsSubMenuOpen(!isSubmenuOpen); }}>
                  <span>Productos</span>
                  <span className='child-trigger right-0'><i className='bx bx-caret-down'></i></span>
                </a>
                <div className={`sub-menu list-block ${isSubmenuOpen ? 'active' : ''}`}>
                  <h3 className="dot-title">Marcas</h3>
                  <ul>
                    {marcasDestacadas.map((marca) => (
                      <li key={marca.id}><a href="#">{marca.nombre}</a></li>
                    ))}
                  </ul>
                </div>
                <div className={`sub-menu list-block ${isSubmenuOpen ? 'active' : ''}`}>
                  <h3 className="dot-title">Tipo Calzado</h3>
                  <ul>
                    {tiposDestacados.map((marca) => (
                      <li key={marca.id}><a href="#">{marca.nombre}</a></li>
                    ))}
                  </ul>
                </div>
                <div className={`sub-menu list-block ${isSubmenuOpen ? 'active' : ''}`}>
                  <h3 className="dot-title">Usuario</h3>
                  <ul>
                    {usuariosDestacados.map((marca) => (
                      <li key={marca.id}><a href="#">{marca.nombre}</a></li>
                    ))}
                  </ul>
                </div>
              </li>
              <li><a href="#marcas" onClick={() => {setIsMobileMenuOpen(false); }}><span>Marcas</span></a></li>
              <li><a href="#contacto" onClick={() => {setIsMobileMenuOpen(false); }}><span>Contacto</span></a></li>
            </ul>
          </nav>
          <div className="button mt-auto">
            <a href="" className="btn secondary-btn">Iniciar Sesion</a>
            <a href="" className="btn primary-btn">Registrarse</a>
          </div>
        </div>
      </div>
    </div>
  );
}
