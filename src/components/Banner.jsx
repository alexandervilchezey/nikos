import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import banner1 from '../assets/images/banner-1.png';
import banner1small from '../assets/images/banner1_small.png';
import banner2 from '../assets/images/banner-2.png';
import banner2small from '../assets/images/banner2_small.png';
import banner4 from '../assets/images/banner-4.png';
import banner4small from '../assets/images/banner4_small.png';
import { useState, useEffect } from 'react';

export default function Banner() {
  const [activeIndex, setActiveIndex] = useState(0)

  const slides = [
    { id: 1, image: {small:banner1small, medium: banner1}, title: 'Activa tu ritmo', textColor: 'primary-btn' },
    { id: 2, image: {small:banner2small, medium: banner2}, title: 'Distinción en cada paso', description:'', textColor: 'primary-btn' },
    { id: 3, image: {small:banner4small, medium: banner4}, title: 'Nikos Kids', description:'', textColor: 'secondary-btn' },
  ];

  const getImageForBreakpoint = (image) => {
  const width = window.innerWidth
  if (width < 780) return image.small
  return image.medium
}

const ResponsiveSlideImage = ({ image }) => {
  const [src, setSrc] = useState(getImageForBreakpoint(image))

  useEffect(() => {
    const handleResize = () => {
      setSrc(getImageForBreakpoint(image))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [image])

  return <img src={src} alt=""/>
}

  return (
    <main>
      <div className="slider">
        <div className="sliderbox">
          <div className="wrap">
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.realIndex)
              }}
             >
               {slides.map((slide, index) => (
                 <SwiperSlide key={slide.id}>
                    <div className="item">
                      <div className="image">
                        <div className="ob-cover">
                          <ResponsiveSlideImage image={slide.image} />
                        </div>
                        <div
                          className={`title-info transition-all duration-[700ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] 
                            ${activeIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}
                          `}
                        >
                          <div className="wide">
                            <div className="wrap">
                              <h3 className={`title ${slide.textColor === 'primary-btn' ? 'md:text-white' : 'md:text-black'}`}>{slide.title}</h3>
                              <div className="button">
                                <a href="" className={`btn ${slide.textColor === 'primary-btn' ? 'primary-btn' : 'secondary-btn'}`}>Compra Ahora</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                 </SwiperSlide>
               ))}
            </Swiper>
          </div>
        </div>
      </div>
    </main>
  );
};