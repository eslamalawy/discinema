import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.min.css";
import CardContent from "./CardContent";

export default function SwiperAuto() {
  return (
    <div className="mt-6 mb-6">
      <h1>NEW</h1>
      <Swiper
        pagination={{
          type: "progressbar",
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 5,
          },
        }}
        className="swProgressContent h-fit"
      >
        <SwiperSlide className="text-center flex justify-center items-center">
          <CardContent />
        </SwiperSlide>
        <SwiperSlide className="text-center flex justify-center items-center">
          Slide 2
        </SwiperSlide>
        <SwiperSlide className="text-center flex justify-center items-center">
          Slide 3
        </SwiperSlide>
        <SwiperSlide className="text-center flex justify-center items-center">
          Slide 4
        </SwiperSlide>
        <SwiperSlide className="text-center flex justify-center items-center">
          Slide 5
        </SwiperSlide>
        <SwiperSlide className="text-center flex justify-center items-center">
          Slide 6
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
