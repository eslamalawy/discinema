import React from "react";
import { useEffect, useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.min.css";
import CardContent from "./CardContent";
import $ from "jquery";
import { Typography } from "@material-tailwind/react";

export default function SwiperAuto(props) {
  const { color, Series, Title } = props;
  const swiperRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    if (color) {
      const swiperInstance = swiperRef.current.swiper;
      const headingInstance = headingRef.current;
      if (swiperInstance && headingRef && color) {
        $(headingInstance).css("color", color);

        $(swiperInstance.$el)
          .find(" .swiper-button-next, .swiper-button-prev")
          .css("color", color);

        $(swiperInstance.$el)
          .find(".swiper-pagination-progressbar-fill")
          .css("background-color", color);
      }
    }
  }, [color, swiperRef]);

  return (
    <div className="mt-7 mb-7">
      <Typography ref={headingRef} className="font-bold text-[2rem] txt-heading">
        {Title}
      </Typography>
      <Swiper
        ref={swiperRef}
        pagination={{
          type: "progressbar",
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        slidesPerView={1}
        spaceBetween={0}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
        className="swProgressContent h-fit "
      >
        {Series.map((serie) => {
          return (
            <SwiperSlide className="text-center flex justify-center items-center">
              <CardContent serie={serie} color={color} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
