import { useEffect, useState } from "react";
import dataProductos from '../utils/dataProductos.js';
import {marcasZapatos, tipoCalzado} from '../utils/dataGeneral.js';

export default function ProductosPage() {
  const [filters, setFilters] = useState({ tipo: [], marca: [], precioMax: 500 });
  const [productos, setProductos] = useState([]);
  const [mostrarModalFiltros, setMostrarModalFiltros] = useState(false);
  const [cantidadVisible, setCantidadVisible] = useState(6);

  useEffect(() => {
    const filtrados = dataProductos.filter((producto) => {
      const cumpleTipo = filters.tipo.length === 0 || filters.tipo.includes(producto.tipoCalzado[0]);
      const cumpleMarca = filters.marca.length === 0 || filters.marca.includes(producto.marca);
      const cumplePrecio = producto.precio <= filters.precioMax;
      return cumpleTipo && cumpleMarca && cumplePrecio;
    });
    setProductos(filtrados);
  }, [filters]);

  const toggleFiltro = (key, valor) => {
    setFilters((prev) => {
      const yaExiste = prev[key].includes(valor);
      const nuevos = yaExiste ? prev[key].filter((v) => v !== valor) : [...prev[key], valor];
      return { ...prev, [key]: nuevos };
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 px-4 py-6">
      {/* Modal Responsive */}
      {mostrarModalFiltros && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
          <div className="bg-white w-64 p-4 overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filtros</h2>
              <button onClick={() => setMostrarModalFiltros(false)}>✕</button>
            </div>
            <Filtros {...{ filters, toggleFiltro, setFilters }} />
          </div>
        </div>
      )}

      {/* Sidebar Filtros */}
      <aside className="hidden md:block w-full max-w-[250px]">
        <Filtros {...{ filters, toggleFiltro, setFilters }} />
      </aside>

      {/* Productos */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">
            Mostrando 1 - {Math.min(cantidadVisible, productos.length)} de {productos.length} productos
          </h1>
          <button className="md:hidden btn border px-4 py-2" onClick={() => setMostrarModalFiltros(true)}>Filtros</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productos.slice(0, cantidadVisible).map((p) => (
            <div key={p.id} className="border p-2 rounded shadow-sm">
              <img src={p.imagenes[0]} alt={p.nombre} className="w-full h-40 object-cover rounded" />
              <h2 className="mt-2 text-sm font-medium">{p.nombre}</h2>
              <p className="text-gray-700 text-sm">s/. {p.precio.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {cantidadVisible < productos.length && (
          <div className="text-center mt-6">
            <button
              onClick={() => setCantidadVisible(cantidadVisible + 6)}
              className="btn border px-4 py-2"
            >
              Ver más
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function Filtros({ filters, toggleFiltro, setFilters }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Tipo de Calzado</h3>
        <div className="space-y-1">
          {tipoCalzado.map((t) => (
            <label key={t.id} className="block text-sm">
              <input
                type="checkbox"
                checked={filters.tipo.includes(t.nombre)}
                onChange={() => toggleFiltro("tipo", t.nombre)}
                className="mr-2"
              />
              {t.nombre}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Marca</h3>
        <div className="space-y-1">
          {marcasZapatos.map((m) => (
            <label key={m.id} className="block text-sm">
              <input
                type="checkbox"
                checked={filters.marca.includes(m.nombre)}
                onChange={() => toggleFiltro("marca", m.nombre)}
                className="mr-2"
              />
              {m.nombre}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Precio máximo: s/. {filters.precioMax}</h3>
        <input
          type="range"
          min="50"
          max="500"
          step="10"
          value={filters.precioMax}
          onChange={(e) => setFilters({ ...filters, precioMax: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  );
}
