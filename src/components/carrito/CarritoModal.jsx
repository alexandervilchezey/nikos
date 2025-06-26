import { useState } from "react";
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

    const irACheckout = () => {
      cerrarModalConAnimacion();
      setTimeout(() => {
        navigate("/checkout");
      }, 400);
    };

  const [avisoMayorista, setAvisoMayorista] = useState('');

  const handleCantidadChange = (item, incremento) => {
    const nuevaCantidad = item.cantidad + incremento;
    if (nuevaCantidad > 3) {
      setAvisoMayorista(item.slug + item.talla + item.color);
    } else {
      setAvisoMayorista('');
    }
    actualizarCantidad(item.slug, item.talla, item.color, nuevaCantidad);
  };

  const calcularTotal = () =>
    carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pb-1 flex flex-row gap-4 justify-between items-center">
        <h2 className="text-xl font-bold">Mi Carrito</h2>
        {carrito.length > 0 && (
           <div className="button text-center">
              <button
                onClick={vaciarCarrito}
                className="btn btm-sm secondary-btn px-2 py-1"
              >
                <i className='bx bx-trash'></i> 
              </button>
            </div>
        )}
      </div>

      <div className="flex-1 gap 2 overflow-y-auto p-2 md:p-4 space-y-4">
        {carrito.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío.</p>
        ) : (
          carrito.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 bg-white py-2 relative"
            >
              <img
                src={item.imagen || placeholder}
                alt={item.nombre}
                className="w-20 h-20 object-cover rounded border"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 cursor-pointer" onClick={() => navigate(`/productos/${item.slug}`)}>{item.nombre}</h3>
                <div className="text-sm text-gray-600 flex">
                  Talla: <span className="font-medium px-1">{item.talla}</span> | Color: {item.color}
                </div>
                <span className="text-sm text-gray-500">
                  S/ {item.precio} c/u
                </span>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => handleCantidadChange(item, -1)}
                    disabled={item.cantidad === 1}
                  >
                    −
                  </button>
                  <input
                    type="text"
                    value={item.cantidad}
                    readOnly
                    className="w-8 text-center border rounded"
                  />
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => handleCantidadChange(item, 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => quitarDelCarrito(item.slug, item.talla, item.color)}
                className="text-red-500 hover:text-red-700 self-start"
                title="Quitar del carrito"
              >
                <i className='bx bx-trash'></i> 
              </button>
            </div>
          ))
        )}
      </div>

      {carrito.length > 0 && (
        <div className="bg-black text-white p-4 border-t">
          {/* <div className="flex justify-between items-center mb-2 text-sm">
            <span>Subtotal:</span>
            <span>S/ {calcularTotal().toFixed(2)}</span>
          </div> */}
          <div className="flex justify-between items-center mb-2 text-sm">
            <span>Total:</span>
            <span className="font-semibold">S/ {calcularTotal().toFixed(2)}</span>
          </div>
          {avisoMayorista !== '' && (
            <p className="text-xs text-gray-400 mb-3">
              Si deseas hacer compras al por mayor, comunícate con nosotros para acceder a mejores precios.
            </p>
          )}
          <button 
            onClick={irACheckout}
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white font-semibold">
            Confirmar compra
          </button>
        </div>
      )}
    </div>
  );
}
