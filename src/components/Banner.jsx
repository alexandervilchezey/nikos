import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import banner1 from '../assets/images/banner-1.png';
import banner2 from '../assets/images/banner-2.png';
import banner3 from '../assets/images/banner-3.png';
import banner4 from '../assets/images/banner-4.png';

export default function Banner() {
  const slides = [
    { id: 1, image: banner1, title: 'Activa tu ritmo', description:'Zapatillas diseñadas para rendir al máximo. Estilo y tecnología para tus entrenamientos.', textColor: 'white' },
    { id: 2, image: banner2, title: 'Slide 1', description:'', textColor: 'white' },
    { id: 3, image: banner3, title: 'Distinción en cada paso', description:'Zapatos que combinan clase, confort y carácter. Perfectos para marcar presencia.', textColor: 'white' },
    { id: 4, image: banner4, title: 'NIKOS KIDS', description:'', textColor: 'black' },
  ];

  return (
      <Swiper
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <section className="main-home pt-[80px] md:pt-[100px]"
              style={{
                backgroundImage: `url(${slide.image})`,
                height: 'calc(100vh - 80px)',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
              }}
            >
              <div className={`main-text ${slide.textColor}`}>
                  <h1>{slide.title}</h1>
                  <p>{slide.description}</p>
                  <div className="main-btn">Comprar Ahora</div>
              </div>
            </section>
            
          </SwiperSlide>
        ))}
      </Swiper>
  );
};