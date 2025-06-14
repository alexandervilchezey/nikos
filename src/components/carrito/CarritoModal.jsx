import { useCarrito } from "./CarritoContext";

export default function CarritoModal() {
  const { carrito, quitarDelCarrito, vaciarCarrito } = useCarrito();

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Mi Carrito</h2>
        {carrito.length > 0 && (
          <button
            onClick={vaciarCarrito}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
          >
            Vaciar carrito
          </button>
        )}
      </div>

      {carrito.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <ul className="space-y-3">
          {carrito.map((producto, index) => (
            <li
              key={index}
              className="flex gap-4 bg-gray-50 p-3 rounded shadow-sm"
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-20 h-20 object-cover rounded border"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {producto.nombre}
                </h3>
                <p className="text-sm text-gray-600">
                  Talla: <span className="font-medium">{producto.talla}</span> | Color:{" "}
                  <span className="font-medium">{producto.color}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Cantidad: <span className="font-medium">{producto.cantidad}</span>
                </p>
              </div>
              <button
                onClick={() => quitarDelCarrito(producto.slug)}
                className="text-red-500 hover:text-red-700 self-start"
                title="Quitar del carrito"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
