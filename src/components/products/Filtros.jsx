import { useState } from "react";

const LIMITE_VISIBLE = 4;

const FiltroGrupo = ({ titulo, items, campo, valoresSeleccionados, toggleFiltro }) => {
  const [abierto, setAbierto] = useState(true);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const visibles = mostrarTodos ? items : items.slice(0, LIMITE_VISIBLE);

  return (
    <div className="pb-4">
      <div
        className="flex justify-between items-center cursor-pointer mb-2"
        onClick={() => setAbierto(!abierto)}
      >
        <h3 className="font-semibold text-gray-800">{titulo}</h3>
        <i className={`bx text-lg ${abierto ? "bx-chevron-up" : "bx-chevron-down"}`} />
      </div>

      {abierto && (
        <div className="space-y-2 pl-1">
          {visibles.map((nombre) => (
            <label key={nombre} className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                className="mr-2 accent-blue-600"
                checked={valoresSeleccionados.includes(nombre)}
                onChange={() => toggleFiltro(campo, nombre)}
              />
              {nombre}
            </label>
          ))}

          {items.length > LIMITE_VISIBLE && (
            <button
              onClick={() => setMostrarTodos(!mostrarTodos)}
              className="text-blue-600 text-xs hover:underline mt-1"
            >
              {mostrarTodos ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default function Filtros({ filters, disponibles, toggleFiltro, setFilters, onFiltrar }) {
  return (
    <>
      <div className="max-h-[75vh] overflow-y-auto pr-2 space-y-6 text-sm text-gray-800">
        <FiltroGrupo
          titulo="Tipo de Calzado"
          items={disponibles.tipo}
          campo="tipo"
          valoresSeleccionados={filters.tipo}
          toggleFiltro={toggleFiltro}
        />

        <FiltroGrupo
          titulo="Marca"
          items={disponibles.marca}
          campo="marca"
          valoresSeleccionados={filters.marca}
          toggleFiltro={toggleFiltro}
        />

        <FiltroGrupo
          titulo="Usuario / Talla"
          items={disponibles.usuario}
          campo="usuario"
          valoresSeleccionados={filters.usuario}
          toggleFiltro={toggleFiltro}
        />

        <FiltroGrupo
          titulo="Material"
          items={disponibles.material}
          campo="material"
          valoresSeleccionados={filters.material}
          toggleFiltro={toggleFiltro}
        />

        <FiltroGrupo
          titulo="Uso"
          items={disponibles.uso}
          campo="uso"
          valoresSeleccionados={filters.uso}
          toggleFiltro={toggleFiltro}
        />

        <FiltroGrupo
          titulo="Origen"
          items={disponibles.origen}
          campo="origen"
          valoresSeleccionados={filters.origen}
          toggleFiltro={toggleFiltro}
        />

        <FiltroGrupo
          titulo="Colores"
          items={disponibles.color}
          campo="color"
          valoresSeleccionados={filters.color}
          toggleFiltro={toggleFiltro}
        />

        <div className="pb-4">
          <h3 className="font-semibold mb-2 flex justify-between items-center">
            Precio máximo: <span className="text-blue-700">S/. {filters.precioMax}</span>
          </h3>
          <input
            type="range"
            min="50"
            max="500"
            step="10"
            value={filters.precioMax}
            onChange={(e) =>
              setFilters({ ...filters, precioMax: parseInt(e.target.value) })
            }
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      <div className="button pt-4">
        <button
          onClick={onFiltrar}
          className="btn primary-btn"
        >
          Filtrar
        </button>
      </div>
    </>
  );
}
