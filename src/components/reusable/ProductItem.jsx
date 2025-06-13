import { useNavigate } from "react-router-dom";

export default function ProductItem({ producto, onClose }) {
  const navigate = useNavigate();

  if (!producto) return null;
  const {
    nombre,
    precio,
    descuento,
    imagenesHover,
  } = producto;

  const handleClick = () => {
    navigate(`/productos/${producto.slug}`);
    if (onClose) onClose();
  };

  const calcularPrecioOriginal = (precio, descuento) => {
    return (precio / (1 - descuento / 100)).toFixed(2);
  };

  const precioOriginal = calcularPrecioOriginal(precio, descuento);

  return (
    <div className="item"
      onClick={handleClick}
    >
      <div className="dot-images">
        <a href="#" className="product-permalink"></a>
        <div className="thumbnail">
          <img className="mx-auto" src={imagenesHover?.[0]} alt={nombre} />
        </div>
        <div className="thumbnail hover">
          <img className="mx-auto" src={imagenesHover?.[1]} alt={`${nombre} hover`} />
        </div>
        <div className="actions">
          <ul>
            <li>
              <a href=""><i className="bx bx-eye"></i></a>
            </li>
          </ul>
        </div>
        <div className="label">
          <span>{descuento}%</span>
        </div>
      </div>
      <div className="dot-info">
        <h2 className="dot-title"><a href="">{nombre}</a></h2>
        <div className="product-price">
          <span className="before">${precioOriginal}</span>
          <span className="current">${precio.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

