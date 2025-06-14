import { useState } from "react";
import ModalFiltros from "../reusable/ModalFiltros";
import { tipoCalzado, usuarioGeneral, marcasZapatos } from "../../utils/dataGeneral";

export default function MobileMenu({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const [animatingClose, setAnimatingClose] = useState(false);
  const [isSubmenuOpen, setIsSubMenuOpen] = useState(false);
  const marcasDestacadas = marcasZapatos.slice(0, 5);
  const tiposDestacados = tipoCalzado.slice(0, 4);
  const usuariosDestacados = usuarioGeneral.slice(0, 4);
  const cerrarModalConAnimacion = () => {
    setAnimatingClose(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setAnimatingClose(false);
    }, 400);
  };

  return (
    <ModalFiltros
      mostrarModalFiltros={isMobileMenuOpen}
      animatingClose={animatingClose}
      cerrarModalConAnimacion={cerrarModalConAnimacion}
    >
      <div className="main-menu scrollto">
          <nav className='wrapper'>
            <ul className="pt-2">
              <li>
                <a className="block" href="/">
                  <span>Inicio</span>
                </a>
              </li>
              <li className='has-child'>
                <a className="flex" href="#" onClick={(e) => { e.preventDefault(); setIsSubMenuOpen(!isSubmenuOpen); }}>
                  <span>Productos</span>
                  <span className='child-trigger flex flex-wrap content-center'>
                    <i className='bx bx-caret-down'></i>
                  </span>
                </a>
                <div className={`mb-2 sub-menu list-block ${isSubmenuOpen ? 'active' : ''}`}>
                  <h3 className="dot-title"><a href="/productos">Ver todo</a></h3>
                </div>
                <div className={`sub-menu list-block ${isSubmenuOpen ? 'active' : ''}`}>
                  <h3 className="dot-title">Marcas</h3>
                  <ul>
                    {marcasDestacadas.map((marca) => (
                      <li key={marca.id}><a className="block" href="#">{marca.nombre}</a></li>
                    ))}
                  </ul>
                </div>
                <div className={`sub-menu list-block ${isSubmenuOpen ? 'active' : ''}`}>
                  <h3 className="dot-title">Tipo Calzado</h3>
                  <ul>
                    {tiposDestacados.map((marca) => (
                      <li key={marca.id}><a className="block" href="#">{marca.nombre}</a></li>
                    ))}
                  </ul>
                </div>
                <div className={`sub-menu list-block ${isSubmenuOpen ? 'active' : ''}`}>
                  <h3 className="dot-title">Usuario</h3>
                  <ul>
                    {usuariosDestacados.map((marca) => (
                      <li key={marca.id}><a className="block" href="#">{marca.nombre}</a></li>
                    ))}
                  </ul>
                </div>
              </li>
              <li><a className="block" href="/#marcas" onClick={() => {setIsMobileMenuOpen(false); }}><span>Marcas</span></a></li>
              <li><a className="block" href="#contacto" onClick={() => {setIsMobileMenuOpen(false); }}><span>Contacto</span></a></li>
            </ul>
          </nav>
          <div className="button mt-auto">
            <a href="" className="btn secondary-btn">Iniciar Sesion</a>
            <a href="" className="btn primary-btn">Registrarse</a>
          </div>
        </div>
    </ModalFiltros>
    
  );
}
