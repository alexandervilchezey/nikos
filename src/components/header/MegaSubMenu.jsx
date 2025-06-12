import ProductItem from '../reusable/ProductItem.jsx';
import dataProductos from '../../utils/dataProductos.js';
import {marcasZapatos, usuarioGeneral, tipoCalzado} from '../../utils/dataGeneral.js';

export default function MegaSubMenu() {
  const productosDestacados = dataProductos
    .filter((producto) => producto.destacado === true)
    .slice(0, 3);

  const marcasDestacadas = marcasZapatos.slice(0, 5);

  return (
    <ul className="sub-mega active">
      <li>
        <div className="wrapper">
          <div className="mega-content">
            <div className="dotgrid">
              <div className="wrapper">
                {productosDestacados.map((producto, index) => (
                  <ProductItem key={index} producto={producto} />
                ))}
              </div>
            </div>

            <div className="links">
              <div className="list-block">
                <h3 className="dot-title">Marcas</h3>
                <ul>
                  {marcasDestacadas.map((marca) => (
                    <li key={marca.id}><a href="#0">{marca.nombre}</a></li>
                  ))}
                </ul>
              </div>
              <div className="list-block">
                <h3 className="dot-title">Tipo Calzado</h3>
                <ul>
                  {tipoCalzado.map((marca) => (
                    <li key={marca.id}><a href="#0">{marca.nombre}</a></li>
                  ))}
                </ul>
              </div>
              <div className="list-block">
                <h3 className="dot-title">Usuario</h3>
                <ul>
                  {usuarioGeneral.map((marca) => (
                    <li key={marca.id}><a href="#0">{marca.nombre}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
}