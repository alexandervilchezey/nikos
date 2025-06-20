import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import { FreeMode, Thumbs, Pagination } from "swiper/modules";

import placeholder from '../../assets/images/no-photo.JPG';

export default function ProductGallery({ producto }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Asegura que haya al menos una imagen
  const imagenes = Array.isArray(producto.imagenes) && producto.imagenes.length > 0
    ? producto.imagenes
    : [placeholder];

  return (
    <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
      {/* Thumbnails - solo en pantallas medianas en adelante */}
      <div className="hidden sm:block w-20 h-[500px]">
        <Swiper
          onSwiper={setThumbsSwiper}
          direction="vertical"
          spaceBetween={10}
          slidesPerView={5.5}
          freeMode={true}
          modules={[Thumbs, FreeMode]}
          watchSlidesProgress
          className="h-full"
        >
          {imagenes.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                className="object-cover w-full h-20 cursor-pointer"
                alt={`Imagen ${index}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Galería principal */}
      <Swiper
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        spaceBetween={0}
        modules={[Thumbs, Pagination]}
        pagination={{ clickable: true }}
        className="w-full max-w-full md992:max-w-[500px] h-full md992:h-[500px] rounded-md overflow-hidden bg-white"
      >
        {imagenes.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              className="object-contain md:object-left w-full h-full"
              alt={`Imagen ${index}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
