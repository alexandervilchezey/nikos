import { useEffect } from 'react';
import {marcasZapatos} from '../../utils/dataGeneral.js';

export default function BrandsSection() {
useEffect(() => {
  const container = document.getElementById("scrolling-container");
  let scrollAmount = 0;
  const speed = 0.5;

  const scroll = () => {
    if (container) {
      container.scrollLeft += speed;
      scrollAmount += speed;
      if (scrollAmount >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0;
        scrollAmount = 0;
      }
    }
    requestAnimationFrame(scroll);
  };

  scroll();
}, []);
  return (
     <div className="brandssection" id='marcas'>
        <div className="wrap">
            <div className="dotgrid">
                <div id="scrolling-container" className="wrapper overflow-x-auto whitespace-nowrap max-w-full">
                    <div className="flex gap-2 py-2">
                        {marcasZapatos.map((marcas, i) => (
                        <div key={i} className="flex-shrink-0 max-w-[220px] w-full bg-gray-100 rounded shadow p-4 flex items-center justify-center">
                            <img src={marcas.image} alt="" className="w-32 h-32 object-contain" />
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
     </div>
  );
};