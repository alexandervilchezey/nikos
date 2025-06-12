import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import { FreeMode, Thumbs, Pagination } from "swiper/modules";
import product04 from "../../assets/images/product_04.png";
import product04b from "../../assets/images/product_04b.png";
import product04c from "../../assets/images/product_04c.png";
import product04d from "../../assets/images/product_04d.png";
import product04e from "../../assets/images/product_04e.png";
import product04f from "../../assets/images/product_04f.png";
import product04g from "../../assets/images/product_04g.png";
import product04h from "../../assets/images/product_04h.png";

const images = [
  product04,
  product04b,
  product04c,
  product04d,
  product04e,
  product04f,
  product04g,
  product04h,
];

export default function ProductGallery() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mr-auto">
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
          {images.map((src, index) => (
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
        className="w-full h-[500px] rounded-md overflow-hidden bg-white"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img src={src} className="object-contain md:object-left w-full h-full" alt={`Imagen ${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
