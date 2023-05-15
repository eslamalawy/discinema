import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, EffectCube } from "swiper";
import "swiper/swiper-bundle.min.css";
import "./slider.css";
import { SpeakerWaveIcon, SpeakerXMarkIcon ,PlayIcon } from "@heroicons/react/24/outline";

export const Slider = ({ slides }) => {
  // handel pagination Bullets to show the logo/
  const renderBullet = (index, className) => {
    //const slideTitle = slides[index].title;
    const smalllogo = slides[index].smalllogo;
    return `<span class="${className}"><img src="${smalllogo}"/></span>`;
  };

  // voice handeling
  const [isMutedClicked, setIsMutedClicked] = React.useState(false);
  const toggleIsMutedClicked = () => setIsMutedClicked((val) => !val);
  const btn_mute = () => {
    console.log("btn mute clicked");
    toggleIsMutedClicked();
  };

  // watch handeling  
  const btn_watch = () => {
    console.log("btn watch clicked");
  }

  return (
    <Swiper
      className="w-full h-full"
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
          {/* right */}
          <div className="swiper-inside-container">
            <div className="group flex flex-col w-1/2 opacity-[0.4] hover:opacity-[1] ">
              <img className="w-1/2 group-hover:scale-[120%] group-hover:mb-[20%] trans-all origin-top-left" src={slide.biglogo} />
              <p className="trans-all text-sm">{slide.subTitle}</p>
              <button
              onClick={btn_watch}
              className="mt-3 flex items-center justify-center rounded  hover:bg-[#da0e5c] bg-[#0c0c0c60] text-white p-2 border border-[#da0e5c]"
            >
              <PlayIcon className="h-5 w-5" /> Watch Now
              
            </button>
            </div>
          </div>
          {/* left */}
          <div className="swiper-inside-container-left">
            <button
              onClick={btn_mute}
              className="flex items-center justify-center rounded-full hover:bg-[#da0e5c] bg-[#0c0c0c60] text-white p-2 border border-[#da0e5c]"
            >
              {isMutedClicked ? (
                <SpeakerWaveIcon className="h-6 w-6" />
              ) : (
                <SpeakerXMarkIcon className="h-6 w-6" />
              )}
            </button>
          </div>
          <img src={slide.image} className="h-full w-full" alt={slide.title} />
        </SwiperSlide>
      ))}

      {/* <!-- Add Pagination --> */}
      <div class="swiper-pagination"></div>
    </Swiper>
  );
};
