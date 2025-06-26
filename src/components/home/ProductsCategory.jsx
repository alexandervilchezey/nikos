import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductItem from "../reusable/ProductItem.jsx";
import MainCategorySelector from "../home/MainCategorySelector.jsx";

export default function ProductsCategory({ productos, usuarios }) {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  const goToProductsPage = () => navigate(`/productos`);

  const getMaxItemsByBreakpoint = () => {
    const w = window.innerWidth;
    if (w >= 1024) return 8;
    if (w >= 768) return 3;
    return 2;
  };

  const handleCategorySelect = (option) => {
    if (!option?.nombre) return;
    setSelectedUsuario(option);
  };

  useEffect(() => {
    if (usuarios.length > 0 && !selectedUsuario) {
      setSelectedUsuario(usuarios[0]);
    }
  }, [usuarios]);

  useEffect(() => {
    if (!selectedUsuario || productos.length === 0) return;
    const usuario = selectedUsuario.nombre;
    const filtrados = productos.filter((p) => p.usuario === usuario);
    const maxItems = getMaxItemsByBreakpoint();
    setFilteredData(filtrados.slice(0, maxItems));
  }, [productos, selectedUsuario]);

  return (
    <div className="bycats">
      <div className="wrap">
        {usuarios.length > 0 && selectedUsuario && (
          <div className="mt-5 md:mt-0 heading sort-list tabs">
            <span className="grey-color mr-3">in</span>
            <MainCategorySelector
              options={usuarios}
              initial={usuarios[0]}
              onSelect={handleCategorySelect}
            />
          </div>
        )}

        <div className="tabbed">
          <div className="sort-data">
            <div className="dotgrid">
              <div
                className={`wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ${
                  filteredData.length > 0 ? "animate-fadeIn" : ""
                }`}
              >
                {filteredData.map((producto, i) => (
                  <ProductItem key={producto.id || i} producto={producto} />
                ))}
              </div>
              <div
                onClick={goToProductsPage}
                className="button my-3 mx-auto min-w-[150px] cursor-pointer"
              >
                <div className="btn primary-btn">Ver más</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
