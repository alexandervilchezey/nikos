import { useState } from "react";
import { useNavigate } from "react-router-dom";

import dataProductos from "../utils/dataProductos";
import ModalFiltros from "../components/reusable/ModalFiltros";
import Filtros from "../components/products/Filtros";

export default function ProductosPage() {
  const [filters, setFilters] = useState({
    tipo: [],
    marca: [],
    usuario: [],
    material: [],
    uso: [],
    origen: [],
    color: [],
    precioMax: 500
  });

  const [productos, setProductos] = useState(dataProductos); // todos por defecto
  const [mostrarModalFiltros, setMostrarModalFiltros] = useState(false);
  const [animatingClose, setAnimatingClose] = useState(false);
  const [cantidadVisible, setCantidadVisible] = useState(6);
  const navigate = useNavigate();

  const handleClick = (producto) => {
    navigate(`/productos/${producto.slug}`);
  };

  const cerrarModalConAnimacion = () => {
    setAnimatingClose(true);
    setTimeout(() => {
      setMostrarModalFiltros(false);
      setAnimatingClose(false);
    }, 400);
  };

  const toggleFiltro = (key, valor) => {
    setFilters((prev) => {
      const yaExiste = prev[key].includes(valor);
      const nuevos = yaExiste ? prev[key].filter((v) => v !== valor) : [...prev[key], valor];
      return { ...prev, [key]: nuevos };
    });
  };

  const handleFiltrar = () => {
    const filtrados = dataProductos.filter((producto) => {
      const cumpleTipo =
        filters.tipo.length === 0 || filters.tipo.some((t) => producto.tipoCalzado.includes(t));

      const cumpleMarca =
        filters.marca.length === 0 || filters.marca.includes(producto.marca);

      const cumplePrecio = producto.precio <= filters.precioMax;

      const cumpleUsuario =
        filters.usuario.length === 0 || filters.usuario.includes(producto.usuario);

      const cumpleMaterial =
        filters.material.length === 0 ||
        filters.material.some((m) => producto.material.includes(m));

      const cumpleUso =
        filters.uso.length === 0 || filters.uso.some((u) => producto.uso.includes(u));

      const cumpleOrigen =
        filters.origen.length === 0 || filters.origen.includes(producto.origen);

      const cumpleColor =
        filters.color.length === 0 ||
        filters.color.some((c) => producto.colores.includes(c));

      return (
        cumpleTipo &&
        cumpleMarca &&
        cumplePrecio &&
        cumpleUsuario &&
        cumpleMaterial &&
        cumpleUso &&
        cumpleOrigen &&
        cumpleColor
      );
    });
    cerrarModalConAnimacion();
    setProductos(filtrados);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 px-4 py-1">
      {/* Modal móvil */}
      <ModalFiltros
        mostrarModalFiltros={mostrarModalFiltros}
        animatingClose={animatingClose}
        cerrarModalConAnimacion={cerrarModalConAnimacion}
        filters={filters}
        toggleFiltro={toggleFiltro}
        setFilters={setFilters}
      >
        <Filtros
          filters={filters}
          setFilters={setFilters}
          toggleFiltro={toggleFiltro}
          onFiltrar={handleFiltrar}
        />
      </ModalFiltros>

      {/* Filtros escritorio */}
      <aside className="hidden md992:block w-full max-w-[250px]">
        <Filtros
          filters={filters}
          setFilters={setFilters}
          toggleFiltro={toggleFiltro}
          onFiltrar={handleFiltrar}
        />
      </aside>

      {/* Productos */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-md font-light">
            Mostrando 1 - {Math.min(cantidadVisible, productos.length)} de {productos.length} productos
          </h1>
          <button
            className="md992:hidden btn border px-3 py-2"
            onClick={() => setMostrarModalFiltros(true)}
          >
            <i className='bx bx-filter'></i> 
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {productos.slice(0, cantidadVisible).map((producto) => (
            <div
              key={producto.slug}
              onClick={() => handleClick(producto)}
              className="cursor-pointer bg-white transition duration-300 flex flex-col"
            >
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={producto.imagenes?.[0]}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <h2 className="text-base text-gray-900 leading-snug break-words mb-1">{producto.nombre}</h2>
                <div className="text-sm text-gray-500 mb-2">{producto.marca}</div>
                <div className="flex flex-wrap items-center space-x-2">
                  <span className="font-semibold text-gray-800 mr-2">s/.{producto.precio}</span>
                  <span className="text-sm text-gray-400 line-through">s/.{producto.precio}</span>
                  <span className="text-sm text-green-500 font-semibold w-full">-{producto.descuento}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cantidadVisible < productos.length && (
          <div className="button text-center mt-6">
            <button
              onClick={() => setCantidadVisible(cantidadVisible + 6)}
              className="btn secondary-btn border px-4 py-2"
            >
              Ver más
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
