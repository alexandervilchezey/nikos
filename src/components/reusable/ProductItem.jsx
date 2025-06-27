import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { optimizarImagenCloudinary } from "../../utils/generalFunctions";

export default function ProductItem({ producto, onClose }) {
  const navigate = useNavigate();
  const [usuarioMayorista, setUsuarioMayorista] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const {
    nombre = "Producto sin nombre",
    precio = 0,
    precioDescuento,
    precioMayorista,
    imagenes = [],
    slug = "",
  } = producto || {};

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const usuarioDoc = JSON.parse(localStorage.getItem('usuario'));
        console.log(usuarioDoc)
        setUsuarioMayorista(usuarioDoc?.usuarioMayorista || false);
      } else {
        setUsuarioMayorista(false);
      }
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    navigate(`/productos/${slug}`);
    if (onClose) onClose();
  };

  const precioFinal = useMemo(() => {
    if (usuarioMayorista && precioMayorista) return precioMayorista;
    return precioDescuento && precioDescuento < precio ? precioDescuento : precio;
  }, [usuarioMayorista, precio, precioDescuento, precioMayorista]);

  const precioOriginal = useMemo(() => {
    if (usuarioMayorista && precioMayorista && precioMayorista < precio) return precio;
    if (!usuarioMayorista && precioDescuento && precioDescuento < precio) return precio;
    return null;
  }, [usuarioMayorista, precio, precioDescuento, precioMayorista]);

  if (!producto || !producto.nombre || !producto.precio || loadingUser) return null;

  return (
    <div className="item cursor-pointer" onClick={handleClick} aria-label={`Producto ${nombre}`}>
      <div className="dot-images relative">
        <div className="thumbnail">
          <img
            loading="lazy"
            className="mx-auto"
            src={optimizarImagenCloudinary(imagenes?.[0])}
            alt={`Imagen principal de ${nombre}`}
          />
        </div>
        <div className="thumbnail hover">
          <img
            loading="lazy"
            className="mx-auto"
            src={optimizarImagenCloudinary(imagenes?.[1] || imagenes?.[0])}
            alt={`Imagen secundaria de ${nombre}`}
          />
        </div>

        {!usuarioMayorista && (
          <div className="label absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            <span>
              -{Math.round(100 - (precioDescuento / precio) * 100)}%
            </span>
          </div>
        )}
      </div>

      <div className="dot-info text-center">
        <h2 className="dot-title text-sm font-semibold truncate">{nombre}</h2>
        <div className="product-price mt-1">
          {precioOriginal && (
            <span className="before line-through text-gray-500 mr-1">
              s/.{precioOriginal.toFixed(2)}
            </span>
          )}
          <span className="current font-bold text-black">
            s/.{precioFinal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
