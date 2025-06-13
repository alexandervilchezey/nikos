import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import dataProductos from '../../utils/dataProductos.js';
import ProductItem from '../reusable/ProductItem.jsx';
import { useRef, useState } from 'react';

export default function ProductsCarousel() {

 const productosDestacados = dataProductos
  .filter(producto => producto.fechaAgregado)
  .sort((a, b) => new Date(b.fechaAgregado) - new Date(a.fechaAgregado))
  .slice(0, 8);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
    const [atBeginning, setAtBeginning] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const handleSlideChange = (swiper) => {
    setAtBeginning(swiper.isBeginning);
    setAtEnd(swiper.isEnd);
    };

  return (
    <div className='products-carousel'>
        <div className="wrap">
            <div className="mt-5 md:mt-0 heading">
                <h2 className="title">Nuevos ingresos</h2>
            </div>
            <div className="inner-wrapper">
                <div className="dotgrid carouselbox">
                    <div className="wrapper relative">
                        <div className="swiper-nav-buttons flex justify-between items-center mb-4">
                            {!atBeginning && (
                                <button
                                    ref={prevRef}
                                    onClick={() => swiperInstance.slidePrev()}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 border border-black rounded-full w-10 h-10 flex items-center justify-center bg-transparent"
                                >
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}
                            {!atEnd && (
                                <button
                                    ref={nextRef}
                                    onClick={() => swiperInstance.slideNext()}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 border border-black rounded-full w-10 h-10 flex items-center justify-center bg-transparent"
                                >
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <Swiper
                            slidesPerView={1}
                            slidesPerGroup={1}
                            spaceBetween={20}
                            loop={false}
                            navigation={{
                                prevEl: prevRef.current,
                                nextEl: nextRef.current
                            }}
                            onSlideChange={handleSlideChange}
                            onSwiper={(swiper) => setSwiperInstance(swiper)}
                            breakpoints={{
                            640: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                            },
                            768: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                            },
                            992: {
                                slidesPerView: 3,
                                slidesPerGroup: 3,
                            },
                            1024: {
                                slidesPerView: 4,
                                slidesPerGroup: 4,
                            },
                            }}
                            modules={[Navigation]}
                            >
                            {productosDestacados.map((producto, index) => (
                                <SwiperSlide key={index}>
                                    <ProductItem key={index} producto={producto} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>  
                </div>
            </div>
        </div>
    </div>
  );
};