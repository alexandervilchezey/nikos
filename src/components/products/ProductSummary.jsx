import { useState } from "react";
import Modal from "../reusable/Modal";
import { useCarrito } from "../carrito/CarritoContext";

export default function ProductSummary({ producto }) {
  const { agregarAlCarrito } = useCarrito();
  const [colorSelected, setColorSelected] = useState('');
  const [tallaSelected, setTallaSelected] = useState('');
  const [countProducts, setCountProducts] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLink = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAgregar = (producto) => {
    if (!tallaSelected || !colorSelected) {
      alert("Selecciona talla y color");
      return;
    }

    const item = {
      slug: producto.slug,
      nombre: producto.nombre,
      imagen: producto.imagenes[0],
      talla: tallaSelected,
      color: colorSelected,
      cantidad: parseInt(countProducts),
      precio: producto.precio,
    };
    console.log(item);
    agregarAlCarrito(item);
  };

  // obtener variante seleccionada
  const varianteSeleccionada = producto.variantes?.find(v => v.codigoColor === colorSelected);

  return (
    <div className="summary">
      <div className="entry">
        <h1 className="title">{producto.nombre}</h1>
        <div className="product-grow">
          <div className="product-price">
            <span className="current">s/.{producto.precioDescuento}</span>
            {producto.precioDescuento && (
              <div className="wrap">
                <span className="before">s/.{producto.precio}</span>
                <span className="discount">
                  -{Math.round(100 - (producto.precioDescuento / producto.precio) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="product-color">
          <span>Colores:</span>
          <div className="wrap">
            {producto.variantes?.map((variante, index) => (
              <button
                key={index}
                style={{ backgroundColor: variante.codigoColor }}
                className={`border rounded-full transition-shadow relative w-10 h-10 ${colorSelected === variante.codigoColor ? 'selected shadow-[inset_0_0_0_4px_var(--white-color)]' : ''}`}
                onClick={() => {
                  setColorSelected(variante.codigoColor);
                  setTallaSelected('');
                }}
              ></button>
            ))}
          </div>
        </div>

        {colorSelected && (
          <div className="product-size mt-4">
            <span>Tallas:</span>
            <div className="wrap">
              {varianteSeleccionada?.tallas?.map(({ talla, stock }) => (
                <button
                  key={talla}
                  onClick={() => stock > 0 && setTallaSelected(talla)}
                  disabled={stock === 0}
                  className={`px-3 py-1 border rounded mx-1 my-1 
                    ${stock === 0 ? 'no-size' : ''} 
                    ${tallaSelected === talla ? 'selected' : ''}`}
                >
                  {talla}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="product-action flex gap-6 justify-left items-center">
          <div className="qty flex flex-wrap">
            <button onClick={() => setCountProducts((prev) => Math.max(1, prev - 1))} className="decrease h-[40px] w-[40px] bg-[#f1f1f1]">-</button>
            <input className="w-[50px] border text-center" readOnly type="number" value={countProducts} />
            <button onClick={() => setCountProducts((prev) => prev + 1)} className="increase h-[40px] w-[40px] bg-[#f1f1f1]">+</button>
          </div>

          <div className="addcart button">
            <button
              onClick={() => handleAgregar(producto)}
              type="submit"
              className="btn primary-btn"
            >
              Añadir al carrito
            </button>
          </div>
        </div>

        <div className="product-control list-inline mt-4">
          <ul>
            <li>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1">
                <i className='bx bx-share'></i>
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
          />
          <button
            onClick={handleCopy}
            className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Copiar enlace
          </button>
          {copied && <p className="text-green-600 mt-2 text-sm">¡Copiado!</p>}
        </div>
      </Modal>
    </div>
  );
}
