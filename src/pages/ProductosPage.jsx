import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase/firebase";

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

  const [productos, setProductos] = useState([]);
  const [mostrarModalFiltros, setMostrarModalFiltros] = useState(false);
  const [animatingClose, setAnimatingClose] = useState(false);
  const [cantidadVisible, setCantidadVisible] = useState(6);
  const [cargando, setCargando] = useState(true);

  const navigate = useNavigate();

  const cerrarModalConAnimacion = () => {
    setAnimatingClose(true);
    setTimeout(() => {
      setMostrarModalFiltros(false);
      setAnimatingClose(false);
    }, 400);
  };

  const handleClick = (producto) => {
    navigate(`/productos/${producto.slug}`);
  };

  const buildQuery = () => {
    const baseRef = collection(db, "productos");
    const conditions = [];

    if (filters.marca.length === 1) {
      conditions.push(where("marca", "==", filters.marca[0]));
    }

    if (filters.usuario.length === 1) {
      conditions.push(where("usuario", "==", filters.usuario[0]));
    }

    if (filters.precioMax < 500) {
      conditions.push(where("precio", "<=", filters.precioMax));
    }

    return conditions.length > 0 ? query(baseRef, ...conditions) : baseRef;
  };

  const handleFiltrar = async () => {
    try {
      setCargando(true);
      const q = buildQuery();
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      // filtrado adicional en frontend
      const filtrados = fetched.filter((producto) => {
        const cumpleTipo =
          filters.tipo.length === 0 ||
          filters.tipo.some((t) => producto.tipoCalzado?.includes(t));

        const cumpleMaterial =
          filters.material.length === 0 ||
          filters.material.some((m) => producto.material?.includes(m));

        const cumpleUso =
          filters.uso.length === 0 ||
          filters.uso.some((u) => producto.uso?.includes(u));

        const cumpleOrigen =
          filters.origen.length === 0 ||
          filters.origen.includes(producto.origen);

        const cumpleColor =
          filters.color.length === 0 ||
          filters.color.some((c) =>
            producto.variantes?.some(
              (v) => v.color?.toLowerCase() === c.toLowerCase()
            )
          );

        return (
          cumpleTipo &&
          cumpleMaterial &&
          cumpleUso &&
          cumpleOrigen &&
          cumpleColor
        );
      });

      setProductos(filtrados);
      setCantidadVisible(6);
    } catch (error) {
      console.error("Error al filtrar productos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    handleFiltrar(); // cargar al inicio
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 px-4 py-1">
      <ModalFiltros
        mostrarModalFiltros={mostrarModalFiltros}
        animatingClose={animatingClose}
        cerrarModalConAnimacion={cerrarModalConAnimacion}
        filters={filters}
        toggleFiltro={(key, val) => {
          setFilters((prev) => {
            const exists = prev[key].includes(val);
            const next = exists
              ? prev[key].filter((v) => v !== val)
              : [...prev[key], val];
            return { ...prev, [key]: next };
          });
        }}
        setFilters={setFilters}
      >
        <Filtros
          filters={filters}
          setFilters={setFilters}
          toggleFiltro={(key, val) => {
            setFilters((prev) => {
              const exists = prev[key].includes(val);
              const next = exists
                ? prev[key].filter((v) => v !== val)
                : [...prev[key], val];
              return { ...prev, [key]: next };
            });
          }}
          onFiltrar={handleFiltrar}
        />
      </ModalFiltros>

      <aside className="hidden md992:block w-full max-w-[250px]">
        <Filtros
          filters={filters}
          setFilters={setFilters}
          toggleFiltro={(key, val) => {
            setFilters((prev) => {
              const exists = prev[key].includes(val);
              const next = exists
                ? prev[key].filter((v) => v !== val)
                : [...prev[key], val];
              return { ...prev, [key]: next };
            });
          }}
          onFiltrar={handleFiltrar}
        />
      </aside>

      <main className="flex-1">
        {cargando ? (
          <p className="text-center mt-10">Cargando productos...</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-md font-light">
                Mostrando 1 - {Math.min(cantidadVisible, productos.length)} de{" "}
                {productos.length} productos
              </h1>
              <button
                className="md992:hidden btn border px-3 py-2"
                onClick={() => setMostrarModalFiltros(true)}
              >
                <i className="bx bx-filter"></i>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {productos.slice(0, cantidadVisible).map((producto) => (
                <div
                  key={producto.id}
                  onClick={() => handleClick(producto)}
                  className="cursor-pointer bg-white transition duration-300 flex flex-col"
                >
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      src={producto.imagenes?.[0] || 'https://via.placeholder.com/400'}
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h2 className="text-base text-gray-900 leading-snug break-words mb-1">
                      {producto.nombre}
                    </h2>
                    <div className="text-sm text-gray-500 mb-2">{producto.marca}</div>
                    <div className="flex flex-wrap items-center space-x-2">
                      <span className="font-semibold text-gray-800 mr-2">s/.{producto.precio}</span>
                      {producto.precioDescuento && (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            s/.{producto.precioDescuento}
                          </span>
                          <span className="text-sm text-green-500 font-semibold w-full">
                            -{Math.round(
                              100 - (producto.precioDescuento / producto.precio) * 100
                            )}
                            %
                          </span>
                        </>
                      )}
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
          </>
        )}
      </main>
    </div>
  );
}
