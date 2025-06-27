import { useState, useEffect } from "react";
import Modal from "../reusable/Modal";
import { useCarrito } from "../carrito/CarritoContext";
import { optimizarImagenCloudinary } from "../../utils/generalFunctions";

export default function ProductSummary({ producto, varianteIndex, setVarianteIndex }) {
  const { agregarAlCarrito } = useCarrito();
  const [tallaSelected, setTallaSelected] = useState('');
  const [countProducts, setCountProducts] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [agregando, setAgregando] = useState(false);
  const [usuarioMayorista, setUsuarioMayorista] = useState(null);

  const shareLink = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("usuario"));
    if (userData?.usuarioMayorista) {
      setUsuarioMayorista(true);
    } else {
      setUsuarioMayorista(false);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAgregar = (producto) => {
    const variante = producto.variantes?.[varianteIndex];
    if (!tallaSelected || !variante) {
      setErrorMensaje("Selecciona talla e imagen");
      return;
    }

    setErrorMensaje('');
    setAgregando(true);

    const item = {
      slug: producto.slug,
      nombre: producto.nombre,
      imagen: variante.imagen,
      talla: tallaSelected,
      color: variante.color || '',
      cantidad: parseInt(countProducts),
      precio: producto.precio,
      precioMayorista: producto.precioMayorista,
      precioDescuento: producto.precioDescuento,

    };

    agregarAlCarrito(item);
    setMensajeExito('Producto añadido al carrito');
    setTimeout(() => {
      setMensajeExito('');
      setAgregando(false);
    }, 2000);
  };

  const varianteSeleccionada = producto.variantes?.[varianteIndex];

  // 🧠 Evita mostrar precios antes de cargar estado
  if (usuarioMayorista === null) return null;

  const precioBase = producto.precio;
  const precioDescuento = producto.precioDescuento;
  const precioMayorista = producto.precioMayorista;

  const mostrarPrecio = usuarioMayorista ? precioMayorista : precioDescuento || precioBase;
  const mostrarOriginal = (!usuarioMayorista && precioDescuento && precioDescuento < precioBase)
    ? precioBase
    : null;

  return (
    <div className="summary">
      <div className="entry">
        <h1 className="title">{producto.nombre}</h1>

        <div className="product-grow">
          <div className="product-price">
            <span className="current">s/.{mostrarPrecio?.toFixed(2)}</span>
            {mostrarOriginal && (
              <div className="wrap">
                <span className="before line-through">s/.{mostrarOriginal.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="product-color">
          <span>Variantes:</span>
          <div className="wrap flex gap-2 flex-wrap">
            {producto.variantes?.map((variante, index) => (
              <img
                key={index}
                src={optimizarImagenCloudinary(variante.imagen)}
                alt={`Variante de color ${variante.color || index + 1}`}
                onClick={() => {
                  setVarianteIndex(index);
                  setTallaSelected('');
                  setErrorMensaje('');
                }}
                className={`w-12 h-12 rounded object-cover border-2 cursor-pointer transition-all
                  ${index === varianteIndex ? 'border-black ring-2 ring-offset-1' : 'border-transparent'}`}
                loading="lazy"
              />
            ))}
          </div>
        </div>

        {varianteSeleccionada && (
          <div className="product-size mt-4 w-[350px] max-w-[350px]">
            <span>Tallas:</span>
            <div className="wrap">
              {(Array.isArray(varianteSeleccionada.tallas) ? [...varianteSeleccionada.tallas] : [])
                .sort((a, b) => a.talla.localeCompare(b.talla, undefined, { numeric: true }))
                .map(({ talla, stock }) => (
                  <button
                    key={talla}
                    onClick={() => {
                      if (stock > 0) {
                        setTallaSelected(talla);
                        setErrorMensaje('');
                      }
                    }}
                    disabled={stock === 0}
                    className={`px-3 py-1 border rounded mx-1 my-1 
                      ${stock === 0 ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500' : 'cursor-pointer'} 
                      ${tallaSelected === talla ? 'selected bg-black text-white' : ''}`}
                    aria-label={`Seleccionar talla ${talla}${stock === 0 ? ' (sin stock)' : ''}`}
                  >
                    {talla}
                  </button>
                ))}
            </div>
          </div>
        )}

        <div className="product-action flex flex-col sm:flex-row gap-6 justify-left items-left md:items-center mt-2">
          <div className="qty flex flex-wrap items-center">
            <button
              onClick={() => setCountProducts((prev) => Math.max(1, prev - 1))}
              className="cursor-pointer decrease h-[40px] w-[40px] bg-[#f1f1f1]"
              aria-label="Disminuir cantidad"
            >-</button>
            <input
              className="w-[50px] border text-center"
              readOnly
              type="number"
              value={countProducts}
              aria-label="Cantidad seleccionada"
            />
            <button
              onClick={() => setCountProducts((prev) => prev + 1)}
              className="cursor-pointer increase h-[40px] w-[40px] bg-[#f1f1f1]"
              aria-label="Aumentar cantidad"
            >+</button>
          </div>

          <div className="addcart button mr-auto">
            <button
              onClick={() => handleAgregar(producto)}
              type="button"
              className="cursor-pointer btn primary-btn min-w-[201px]"
              disabled={agregando}
              aria-label="Agregar al carrito"
            >
              {agregando ? 'Agregando...' : 'Añadir al carrito'}
            </button>
          </div>
        </div>

        {errorMensaje && (
          <p className="text-sm text-red-600 m-0" role="alert">{errorMensaje}</p>
        )}

        {mensajeExito && (
          <p className="text-sm text-green-600 m-0" role="status">{mensajeExito}</p>
        )}

        <div className="product-control list-inline mt-4">
          <ul>
            <li>
              <button
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer flex items-center gap-1"
                aria-label="Compartir producto"
              >
                <i className='bx bx-share' aria-hidden="true"></i>
                <span>Compartir Producto</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-4">Comparte este producto</h2>
          <input
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
            value={shareLink}
            aria-label="Enlace del producto"
          />
          <button
            onClick={handleCopy}
            className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            aria-label="Copiar enlace"
          >
            Copiar enlace
          </button>
          {copied && <p className="text-green-600 mt-2 text-sm">¡Copiado!</p>}
        </div>
      </Modal>
    </div>
  );
}
