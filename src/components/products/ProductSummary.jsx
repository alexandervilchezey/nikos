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
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Se borra luego de 2 segundos
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
    console.log('item', item);
    agregarAlCarrito(item);
  };


  return (
    <div className="summary">
      <div className="entry">
        <h1 className="title">{producto.nombre}</h1>
        <div className="product-grow">
          <div className="product-price">
            <span className="current">s/.{producto.precio}</span>
            <div className="wrap">
              <span className="before">s/.{producto.precio}</span>
              <span className="discount">{producto.descuento}%</span>
            </div>
          </div>
        </div>
        <div className="product-color">
          <span>Colores:</span>
          <div className="wrap">
            {producto.colores.map((color, index) => (
              <button
                key={index}
                style={{ backgroundColor: `${color}` }}
                className={`border ${colorSelected === color ? 'selected' : ''}`}
                onClick={() => { setColorSelected(color) }}
              ></button>
            ))}
          </div>
        </div>
        <div className="product-size">
          <span>Tallas:</span>
          <div className="wrap">
            {Object.entries(producto.stockPorTalla).map(([talla, stock]) => (
              <button
                key={talla}
                onClick={() => { if (stock > 0) { setTallaSelected(talla); } }}
                className={`${stock === 0 ? 'no-size' : ''} ${tallaSelected === talla ? 'selected' : ''}`}
              >
                {talla}
              </button>
            ))}
          </div>
        </div>
        <div className="product-action">
          <div className="qty flex flex-wrap">
            <button onClick={() => { if (countProducts > 1) { setCountProducts(countProducts - 1) } }} className="decrease h-[40px] w-[40px] bg-[#f1f1f1]">-</button>
            <input readOnly type="number" value={countProducts} />
            <button onClick={() => setCountProducts(countProducts + 1)} className="increase h-[40px] w-[40px] bg-[#f1f1f1]">+</button>
          </div>
          <div className="addcart button">
            <button onClick={() => handleAgregar(producto)} type="submit" className="btn primary-btn">Añadir al carrito</button>
          </div>
        </div>
        <div className="product-control list-inline">
          <ul>
            <li><a href=""><i className='bx bx-heart'></i><span>Añadir a favoritos</span></a></li>
            <li>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1">
                    <i className='bx bx-share'></i>
                    <span>Compartir</span>
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
            Copiar todo
          </button>
          {copied && <p className="text-green-600 mt-2 text-sm">¡Copiado!</p>}
        </div>
      </Modal>
    </div>
  );
};
