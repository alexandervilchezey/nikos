import ProductItem from "../reusable/ProductItem.jsx";
import MainCategorySelector from "../home/MainCategorySelector.jsx";
import dataProductos from '../../utils/dataProductos.js';
import {usuarioGeneral} from '../../utils/dataGeneral.js';
import { useEffect, useState } from "react";

export default function ProductsCategory() {
const [filteredData, setFilteredData] = useState([]);

const getMaxItemsByBreakpoint = () => {
  const width = window.innerWidth;

  if (width >= 1024) return 8;
  if (width >= 768) return 3;
  return 2;
};

const handleCategorySelect = (option) => {

    setFilteredData([]);

    const usuario = option.nombre;
    let filtrados;

    if (usuario === 'Niño/a') {
        filtrados = dataProductos.filter(item => {
        const user = item.usuario;
        return user === 'Niño' || user === 'Niña';
        });
    } else {
        filtrados = dataProductos.filter(item => item.usuario === usuario);
    }
    const maxItemsResponsive = getMaxItemsByBreakpoint();
    const max4 = filtrados.slice(0, maxItemsResponsive);
    setFilteredData(max4);
};

useEffect(() => {
  if (usuarioGeneral.length > 0) {
    handleCategorySelect(usuarioGeneral[0]);
  }
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
                <div className={`sort-data`}>
                    <div className="dotgrid">
                        <div className={`wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ${filteredData.length > 0 ? 'animate-fadeIn' : ''}`}>
                        {filteredData.map((producto, index) => (
                            <ProductItem key={index} producto={producto} />
                        ))}
                        </div>
                        <div className="button my-3 mx-auto min-w-[150px] w-[150px] cursor-pointer">
                            <div className="btn primary-btn">Ver más</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     </div>
  );
};