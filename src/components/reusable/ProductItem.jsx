import { useNavigate } from "react-router-dom";
import NoPhoto from '../../assets/images/no-photo.JPG'

export default function ProductItem({ producto, onClose }) {
  const navigate = useNavigate();

  if (!producto || !producto.nombre || !producto.precio) return null;

  const {
    nombre = "Producto sin nombre",
    precio = 0,
    precioDescuento,
    descuento = 0,
    imagenes = [],
    slug = "",
  } = producto;

  const handleClick = () => {
    navigate(`/productos/${slug}`);
    if (onClose) onClose();
  };

  const precioOriginal = precioDescuento && precioDescuento < precio
    ? precio
    : null;

  const porcentajeDescuento = precioDescuento && precioDescuento < precio
    ? Math.round(100 - (precioDescuento / precio) * 100)
    : descuento;

  return (
    <div className="item" onClick={handleClick}>
      <div className="dot-images">
        <div className="thumbnail">
          <img
            className="mx-auto"
            src={imagenes?.[0] || NoPhoto}
            alt={nombre}
          />
        </div>
        <div className="thumbnail hover">
          <img
            className="mx-auto"
            src={imagenes?.[1] || imagenes?.[0] || NoPhoto}
            alt={`${nombre} hover`}
          />
        </div>
        {(porcentajeDescuento > 0 && imagenes?.[0]) && (
          <div className="label">
            <span>{porcentajeDescuento}%</span>
          </div>
        )}
      </div>

      <div className="dot-info">
        <h2 className="dot-title">{nombre}</h2>
        <div className="product-price">
          {precioOriginal && (
            <span className="before">s/.{precioOriginal.toFixed(2)}</span>
          )}
          <span className="current">
            s/.{(precioDescuento && precioDescuento < precio
              ? precioDescuento
              : precio
            ).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
