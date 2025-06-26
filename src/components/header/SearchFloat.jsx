import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function SearchFloat({ isSearchOpen, setIsSearchOpen, productos }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cargandoRemoto, setCargandoRemoto] = useState(false);
  const navigate = useNavigate();

  const fuse = useMemo(() => {
    return new Fuse(productos, {
      keys: ["nombre", "descripcion", "marca", "etiquetas", "tipoCalzado", "uso", "material", "origen"],
      threshold: 0.3,
      includeMatches: true,
    });
  }, [productos]);

  // debounce casero
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const buscarProductos = useCallback(
    debounce(async (term) => {
      if (productos.length > 0) {
        const resultadosFuse = fuse.search(term);
        setResultados(resultadosFuse);
      } else {
        setCargandoRemoto(true);
        const productosRef = collection(db, "productos");
        const querySnapshot = await getDocs(productosRef); // puedes optimizar con 'where' si tienes índices
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const fuseRemoto = new Fuse(data, {
          keys: ["nombre", "descripcion", "marca", "etiquetas", "tipoCalzado", "uso", "material", "origen"],
          threshold: 0.3,
          includeMatches: true,
        });
        const resultadosRemotos = fuseRemoto.search(term);
        setResultados(resultadosRemotos);
        setCargandoRemoto(false);
      }
    }, 300),
    [fuse, productos]
  );

  useEffect(() => {
    if (!isSearchOpen) {
      setSearchTerm("");
      setResultados([]);
      return;
    }

    const term = searchTerm.trim();
    if (term === "") {
      setResultados([]);
      return;
    }

    buscarProductos(term);
  }, [searchTerm, isSearchOpen, buscarProductos]);

  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  const closeSearch = () => setIsSearchOpen(false);

  const highlightMatch = (text, matches) => {
    if (!matches || matches.length === 0) return text;
    let result = "";
    let lastIndex = 0;
    matches[0].indices.forEach(([start, end]) => {
      result += text.slice(lastIndex, start);
      result += `<mark class='bg-yellow-200'>${text.slice(start, end + 1)}</mark>`;
      lastIndex = end + 1;
    });
    result += text.slice(lastIndex);
    return result;
  };

  return (
    <>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/30 backdrop-blur-sm">
          <div className="fixed top-0 left-0 right-0 h-20 bg-white shadow-md z-[1001]">
            <form className="relative h-full w-full flex items-center px-4">
              <i className="bx bx-search text-xl absolute left-4" />
              <input
                type="search"
                placeholder="Buscar productos"
                value={searchTerm}
                autoFocus
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 w-full h-full outline-none border-none text-base"
              />
              <i
                className="bx bx-x text-xl absolute right-4 cursor-pointer"
                onClick={closeSearch}
              />
            </form>

            {searchTerm.trim() !== "" && (
              <div className="bg-white max-h-[calc(100vh-10rem)] overflow-y-auto border-t border-gray-200 shadow rounded-b-md flex flex-col">
                <ul className="divide-y divide-gray-100 flex-1 overflow-y-auto">
                  {cargandoRemoto ? (
                    <li className="px-4 py-4 text-sm text-gray-500 text-center">Buscando...</li>
                  ) : (
                    <>
                      {resultados.length > 0 ? (
                        resultados.map(({ item, matches }) => (
                          <li
                            key={item.id}
                            className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => {
                              navigate(`/productos/${item.slug}`);
                              closeSearch();
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <i className="bx bx-sneaker text-gray-400 text-base"></i>
                              <span
                                className="truncate"
                                dangerouslySetInnerHTML={{
                                  __html: highlightMatch(
                                    item.nombre,
                                    matches?.find((m) => m.key === "nombre") ? [matches.find((m) => m.key === "nombre")] : []
                                  ),
                                }}
                              ></span>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-4 text-sm text-gray-500 text-center">
                          No encontramos el producto que buscas.
                        </li>
                      )}
                    </>
                  )}
                </ul>

                <div className="border-t px-4 py-3 bg-white sticky bottom-0 z-10">
                  <button
                    onClick={() => {
                      navigate("/productos");
                      closeSearch();
                    }}
                    className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    <i className="bx bx-store-alt text-lg"></i>
                    <span>Ver todos los productos</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
