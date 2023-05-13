import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, EffectCube } from "swiper";
import "swiper/swiper-bundle.min.css";
import "./slider.css";
export const Slider = ({ slides }) => {
  const renderBullet = (index, className) => {
    const slideTitle = slides[index].title;
    return `<span class="${className}">${slideTitle}</span>`;
  };

  return (
    <Swiper
      className="w-full h-screen"
      modules={[Navigation, Pagination, Scrollbar, A11y, EffectCube]}
      spaceBetween={50}
      slidesPerView={3}
      navigation={{}}
      pagination={{
        el: ".swiper-pagination",
        renderBullet,
        clickable: true,
        dynamicBullets: true,
      }}
      scrollbar={{ draggable: true, snapOnRelease: true }}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      effect={"cube"}
      cubeEffect={{
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      }}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.image}>
          <div className="swiper-inside-container">
            <p>{slide.subTitle}</p>
          </div>
          <img src={slide.image} alt={slide.title} />
        </SwiperSlide>
      ))}

      {/* <!-- Add Pagination --> */}
      <div class="swiper-pagination"></div>
    </Swiper>
  );
};
