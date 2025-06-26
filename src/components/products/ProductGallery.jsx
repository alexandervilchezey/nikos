import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import { FreeMode, Thumbs, Pagination } from "swiper/modules";

import placeholder from "../../assets/images/no-photo.JPG";

export default function ProductGallery({ producto, varianteIndex }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  const imagenes = Array.isArray(producto.imagenes) && producto.imagenes.length > 0
    ? producto.imagenes
    : [placeholder];

  // Cambiar imagen cuando se selecciona una variante
  useEffect(() => {
    if (
      producto.variantes?.[varianteIndex]?.imagen &&
      imagenes.includes(producto.variantes[varianteIndex].imagen)
    ) {
      setImagenSeleccionada(producto.variantes[varianteIndex].imagen);
      const index = imagenes.indexOf(producto.variantes[varianteIndex].imagen);
      if (mainSwiper && index >= 0) {
        mainSwiper.slideTo(index);
      }
    }
  }, [varianteIndex, producto, imagenes, mainSwiper]);

  const handleThumbClick = (src, index) => {
    setImagenSeleccionada(src);
    if (mainSwiper) {
      mainSwiper.slideTo(index);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
      {/* Miniaturas */}
      <div className="hidden sm:block w-20 h-[500px]">
        <Swiper
          onSwiper={setThumbsSwiper}
          direction="vertical"
          spaceBetween={10}
          slidesPerView={5.5}
          freeMode={true}
          watchSlidesProgress
          modules={[Thumbs, FreeMode]}
          className="h-full"
        >
          {imagenes.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                onClick={() => handleThumbClick(src, index)}
                className={`object-cover w-full h-20 cursor-pointer rounded border 
                  ${imagenSeleccionada === src ? "ring-2 ring-black" : ""}`}
                alt={`Miniatura ${index}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Galería principal */}
      <Swiper
        onSwiper={setMainSwiper}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        spaceBetween={0}
        modules={[Thumbs, Pagination]}
        pagination={{ clickable: true }}
        className="w-full max-w-full md992:max-w-[500px] h-full md992:h-[500px] rounded-md overflow-hidden bg-white"
        onSlideChange={(swiper) => setImagenSeleccionada(imagenes[swiper.activeIndex])}
      >
        {imagenes.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              className="object-contain w-full h-full"
              alt={`Imagen ${index}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
