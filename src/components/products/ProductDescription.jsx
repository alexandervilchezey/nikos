import { useState } from "react";

export default function ProductDescription({producto}) {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Tabs */}
      <nav className="border-b border-gray-300">
        <ul className="flex flex-wrap gap-4">
          <li>
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'description'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              Detalle del producto
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('additional')}
              className={`pb-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'additional'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              Información adicional
            </button>
          </li>
        </ul>
      </nav>

      {/* Tab Content */}
      <div className="mt-6 text-gray-700 space-y-6">
        {activeTab === 'description' && (
          <>
            <h3 className="text-xl font-bold">{producto.nombre}</h3>
            <p className="text-base">{producto.descripcion}</p>
            <ul className="list-disc list-inside mt-4 space-y-1">
              <li><strong>Marca:</strong> {producto.marca}</li>
              <li><strong>Precio:</strong> ${producto.precio} <span className="text-sm text-red-500 ml-2">-{producto.descuento}% OFF</span></li>
              <li><strong>Usuario:</strong> {producto.usuario}</li>
              <li><strong>Uso:</strong> {producto.uso.join(', ')}</li>
              <li><strong>Tipo de calzado:</strong> {producto.tipoCalzado.join(', ')}</li>
              <li><strong>Origen:</strong> {producto.origen}</li>
            </ul>

            {/* Colores */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Colores disponibles:</h4>
              <div className="flex gap-2">
                {producto.colores.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></div>
                ))}
              </div>
            </div>

            {/* Tallas */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Stock por talla:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(producto.stockPorTalla).map(([talla, stock]) => (
                  <div
                    key={talla}
                    className={`px-3 py-1 rounded border text-sm ${
                      stock > 0 ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-200 text-gray-500 line-through'
                    }`}
                  >
                    Talla {talla}: {stock} {stock === 1 ? 'unidad' : 'unidades'}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'additional' && (
          <>
            <h3 className="text-xl font-bold">Información adicional</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Materiales:</strong> {producto.material.join(', ')}</li>
              <li><strong>Fecha de agregado:</strong> {new Date(producto.fechaAgregado * 1000).toLocaleDateString()}</li>
              <li><strong>Etiquetas:</strong> {producto.etiquetas.join(', ')}</li>
              <li><strong>Destacado:</strong> {producto.destacado ? 'Sí' : 'No'}</li>
              <li><strong>Slug:</strong> <code>{producto.slug}</code></li>
              <li><strong>ID del producto:</strong> {producto.id}</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};