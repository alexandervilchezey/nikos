import { useEffect, useState, useMemo } from "react";
import { useCarrito, useModalCarrito } from "./CarritoContext";
import { useNavigate } from "react-router-dom";
import placeholder from '../../assets/images/no-photo.JPG';

export default function CarritoModal() {
  const {
    carrito,
    quitarDelCarrito,
    vaciarCarrito,
    actualizarCantidad,
  } = useCarrito();

  const navigate = useNavigate();
  const { cerrarModalConAnimacion } = useModalCarrito();
  const [usuarioMayorista, setUsuarioMayorista] = useState(null);
  const [avisoMayorista, setAvisoMayorista] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("usuario"));
    setUsuarioMayorista(userData?.usuarioMayorista || false);
  }, []);

  const irACheckout = () => {
    cerrarModalConAnimacion();
    setTimeout(() => navigate("/checkout"), 400);
  };

  const handleCantidadChange = (item, incremento) => {
    const nuevaCantidad = item.cantidad + incremento;
    if (nuevaCantidad > 3) {
      setAvisoMayorista(item.slug + item.talla + item.color);
    } else {
      setAvisoMayorista('');
    }
    console.log(avisoMayorista);
    actualizarCantidad(item.slug, item.talla, item.color, nuevaCantidad);
  };

  const calcularTotal = useMemo(() => {
    return carrito.reduce((sum, item) => {
      const precio = usuarioMayorista
        ? item.precioMayorista
        : item.precioDescuento || item.precio;
      return sum + (precio * item.cantidad);
    }, 0);
  }, [carrito, usuarioMayorista]);

  if (usuarioMayorista === null) return null; // Esperar a detectar el estado

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pb-1 flex justify-between items-center button">
        <h2 className="text-xl font-bold">Mi Carrito</h2>
        {carrito.length > 0 && (
          <button
            onClick={vaciarCarrito}
            className="btn btn-sm secondary-btn px-2 py-1"
            aria-label="Vaciar carrito"
          >
            <i className='bx bx-trash'></i>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4">
        {carrito.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío.</p>
        ) : (
          carrito.map((item, index) => {
            const precioUnitario = usuarioMayorista
              ? item.precioMayorista
              : item.precioDescuento || item.precio;

            return (
              <div
                key={`${item.slug}-${item.talla}-${item.color}-${index}`}
                className="flex gap-4 bg-white py-2 relative"
              >
                <img
                  src={item.imagen || placeholder}
                  alt={`Imagen de ${item.nombre}`}
                  className="w-20 h-20 object-cover rounded border"
                  loading="lazy"
                />

                <div className="flex-1">
                  <h3
                    className="font-semibold text-gray-800 cursor-pointer hover:underline"
                    onClick={() => navigate(`/productos/${item.slug}`)}
                    aria-label={`Ir a ${item.nombre}`}
                  >
                    {item.nombre}
                  </h3>
                  <div className="text-sm text-gray-600 flex gap-2">
                    <span>Talla: <strong>{item.talla}</strong></span>
                    <span>|</span>
                    <span>Color: {item.color}</span>
                  </div>

                  <div className="text-sm text-gray-700 mt-1">
                    S/ {precioUnitario?.toFixed(2)} c/u
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() => handleCantidadChange(item, -1)}
                      disabled={item.cantidad === 1}
                      aria-label="Disminuir cantidad"
                    >
                      −
                    </button>
                    <input
                      type="text"
                      value={item.cantidad}
                      readOnly
                      className="w-8 text-center border rounded"
                      aria-label="Cantidad"
                    />
                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() => handleCantidadChange(item, 1)}
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => quitarDelCarrito(item.slug, item.talla, item.color)}
                  className="text-red-500 hover:text-red-700 self-start"
                  title="Quitar del carrito"
                  aria-label={`Quitar ${item.nombre}`}
                >
                  <i className='bx bx-trash'></i>
                </button>
              </div>
            );
          })
        )}
      </div>

      {carrito.length > 0 && (
        <div className="bg-black text-white p-4 border-t">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span>Total:</span>
            <span className="font-semibold">S/ {calcularTotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Si deseas hacer compras al por mayor, comunícate con nosotros para acceder a mejores precios.
          </p>
          <button
            onClick={irACheckout}
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white font-semibold transition"
            aria-label="Confirmar compra"
          >
            Confirmar compra
          </button>
        </div>
      )}
    </div>
  );
}
