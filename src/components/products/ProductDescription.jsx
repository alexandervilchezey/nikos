import { useState } from "react";

export default function ProductDescription({ producto }) {
  const [activeTab, setActiveTab] = useState('description');

  // Aplanar variantes para colores y tallas con stock
  const colores = producto.variantes?.map((v) => ({
    nombre: v.color,
    codigo: v.codigoColor
  })) || [];

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
              <li>
                <strong>Precio:</strong> s/.{producto.precio}
                {producto.precioDescuento && (
                  <span className="text-sm text-red-500 ml-2">
                    -{Math.round(100 - (producto.precioDescuento / producto.precio) * 100)}% OFF
                  </span>
                )}
              </li>
              {/* <li><strong>Usuario:</strong> {producto.usuario}</li> */}
              <li><strong>Uso:</strong> {producto.uso?.join(', ')}</li>
              <li><strong>Tipo de calzado:</strong> {producto.tipoCalzado}</li>
              <li><strong>Origen:</strong> {producto.origen}</li>
            </ul>
          </>
        )}

        {activeTab === 'additional' && (
          <>
            <h3 className="text-xl font-bold">Información adicional</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Materiales:</strong> {producto.material?.join(', ')}</li>
              <li><strong>Etiquetas:</strong> {producto.etiquetas?.join(', ')}</li>
              <li><strong>Slug:</strong> <code>{producto.slug}</code></li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
