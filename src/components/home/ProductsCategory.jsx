import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import ProductItem from "../reusable/ProductItem.jsx";
import MainCategorySelector from "../home/MainCategorySelector.jsx";
import { usuarioGeneral } from '../../utils/dataGeneral.js';

export default function ProductsCategory() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(usuarioGeneral[0]);

  const goToProductsPage = () => {
    navigate(`/productos`);
  };

  const getMaxItemsByBreakpoint = () => {
    const width = window.innerWidth;
    if (width >= 1024) return 8;
    if (width >= 768) return 3;
    return 2;
  };

  const handleCategorySelect = (option) => {
    if (!option || !option.nombre) return;
    setSelectedUsuario(option);
  };

  // Aplicar filtro cada vez que productos o la categoría cambian
  useEffect(() => {
    if (!selectedUsuario || productos.length === 0) return;

    const usuario = selectedUsuario.nombre;
    let filtrados;

    if (usuario === "Niño/a") {
      filtrados = productos.filter(
        (item) => item.usuario === "Niño" || item.usuario === "Niña"
      );
    } else {
      filtrados = productos.filter((item) => item.usuario === usuario);
    }

    const maxItemsResponsive = getMaxItemsByBreakpoint();
    setFilteredData(filtrados.slice(0, maxItemsResponsive));
  }, [productos, selectedUsuario]);

  // Obtener productos al montar
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(docs);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="bycats">
      <div className="wrap">
        <div className="mt-5 md:mt-0 heading sort-list tabs">
          <span className="grey-color mr-3">in</span>
          <MainCategorySelector
            options={usuarioGeneral}
            initial={usuarioGeneral[0]}
            onSelect={handleCategorySelect}
          />
        </div>
        <div className="tabbed">
          <div className="sort-data">
            <div className="dotgrid">
              <div className={`wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ${filteredData.length > 0 ? 'animate-fadeIn' : ''}`}>
                {filteredData.map((producto, index) => (
                  <ProductItem key={producto.id || index} producto={producto} />
                ))}
              </div>
              <div onClick={goToProductsPage} className="button my-3 mx-auto min-w-[150px] w-[150px] cursor-pointer">
                <div className="btn primary-btn">Ver más</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
