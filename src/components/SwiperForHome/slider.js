import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectCube,
  Autoplay,
} from "swiper";
import "swiper/swiper-bundle.min.css";
import "./slider.css";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { SamVid } from "../SampleVideojs/Sample";
import $ from "jquery";
import videojs from "video.js";

export const Slider = ({ slides }) => {
  // handel pagination Bullets to show the logo/
  const renderBullet = (index, className) => {
    //const slideTitle = slides[index].title;
    const smalllogo = slides[index].smalllogo;
    return `<span class="${className}"><img src="${smalllogo}"/></span>`;
  };

  // voice handeling
  const [isMutedClicked, setIsMutedClicked] = useState(false);
  const toggleIsMutedClicked = () => setIsMutedClicked((val) => !val);
  const btn_mute = () => {
    console.log("btn mute clicked");
    toggleIsMutedClicked();
  };

  // watch handeling
  const btn_watch = () => {
    console.log("btn watch clicked");
    // VideoPlayer.currentTime(0);
    // VideoPlayer.pause();
  };

  const swiperRef = useRef(null);
  useEffect(() => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      //console.log("Swiper instance:", swiperInstance);
      //swiperInstance.slideNext();

      const VIDEO_PLAYING_STATE = {
        PLAYING: "PLAYING",
        PAUSE: "PAUSE",
      };
      let videoPlayStatus = VIDEO_PLAYING_STATE.PAUSE;
      let timeout = null;
      let new_timeout = null;
      const waiting = 3000;

      swiperInstance.on("reachBeginning", function () {
        console.log("this2 first slide");
        
      });

      // swiperInstance.on("beforeSlideChangeStart", function () {
      //   console.log("before the actual slide change");

      //   let activeSlideIndex = swiperInstance.activeIndex;
      //   let activeSlide = swiperInstance.slides[activeSlideIndex];
      //   let myimage_ref = activeSlide.querySelector(".swiper-slide #bannerimg");
      //   let myvideo_ref = activeSlide.querySelector(
      //     ".swiper-slide #bannervideo"
      //   );

      //   $("div#bannervideo").hide();
      //   $("img#bannerimg").show();
      //   let monvidio = myvideo_ref.querySelector(".video-js");
      //   let monplayer = videojs(monvidio);

      //   monplayer.pause();
      //   monplayer.src('');

      // });

      swiperInstance.on("slideChange", function () {
        console.log("wallhiiiiiiiiiiiiiiiiiiiiiiiii slide changed");
        $("div#bannervideo").hide();
        $("img#bannerimg").show();

        let activeSlideIndex = swiperInstance.activeIndex;
        let activeSlide = swiperInstance.slides[activeSlideIndex];

        let myslide_data = slides[swiperInstance.activeIndex];
        // console.log("data: ", myslide_data?.videoSrc);
        let myimage_ref = activeSlide.querySelector(".swiper-slide #bannerimg");
        let myvideo_ref = activeSlide.querySelector(
          ".swiper-slide #bannervideo"
        );

        const players = videojs.getAllPlayers();
        players.map((player, index) => {
          player.pause();
          player.hide();
        });

        let monvidio = myvideo_ref.querySelector(".video-js");
        let monplayer = videojs.getPlayer(monvidio);
        monplayer.src({
          type: myslide_data?.VideoType,
          src: myslide_data?.videoSrc,
        });
        monplayer.poster(myslide_data?.image);
        //console.log("monplayer: ", monplayer);

        monplayer.off("ended");
        monplayer.on("ended", () => {
          next();
          console.log("MONPLAYER:", "player finished the video");
        });

        monplayer.off("loadedmetadata");
        monplayer.on("loadedmetadata", () => {
          console.log("MONPLAYER:", "player loaded the video");
        });

        monplayer.off("error");
        monplayer.on("error", () => {
          next();
          console.log(
            "MONPLAYER:",
            "player cannot read video or Error occured"
          );
        });

        if (myimage_ref && myvideo_ref) {
          $(myimage_ref).hide();
          $(myvideo_ref).show();
          //monplayer.currentTime(0);

          monplayer.show();
          monplayer.play("unmuted");
          videoPlayStatus = VIDEO_PLAYING_STATE.PLAYING;
          //   monplayer.autoplay('muted');
        }

        function prev() {
          swiperInstance.slidePrev();
        }

        function next() {
          $(myimage_ref).show();
          $(myvideo_ref).hide();
          new_timeout = setTimeout(function () {
            swiperInstance.slideNext();
          }, waiting);
        }

        function runNext() {
          timeout = setTimeout(function () {
            if (videoPlayStatus === VIDEO_PLAYING_STATE.PLAYING) {
            } else {
              next();
            }
          }, waiting);
        }

        runNext();
      });

      swiperInstance.on("reachEnd", function () {
        console.log("this2 last slide");
        //swiperInstance.autoplay.stop();
      });
    }
  }, [swiperRef]);

  //handel the volume
  useEffect(() => {
    const players = videojs.getAllPlayers();
    const activeIndex = swiperRef.current.swiper.activeIndex;
    const activePlayer = players[activeIndex];
    let old_time =  activePlayer.currentTime();
    players.map((player, index) => {
      player.hide();
      player.muted(!isMutedClicked);
      if (index === activeIndex) {
        if (isMutedClicked) {
          player.play("unmuted");
          player.currentTime(old_time);
          player.show();
        } else {
          player.play("muted");
          player.currentTime(old_time);
          player.show();
        }
      } else {
        player.pause();
      }

      // if (activePlayer.paused() && !isMutedClicked) {
      //   activePlayer.play();
      // }

    });
  }, [isMutedClicked]);

  //https://stackoverflow.com/questions/53945763/componentdidmount-equivalent-on-a-react-function-hooks-component
  // This will run one time after the component mounts
  // useEffect(() => {
  //   // callback function to call when event triggers
  //   const onPageLoad = () => {
  //     console.log("page loaded");
  //     // do something else
  //   };

  //   // Check if the page has already loaded
  //   if (document.readyState === "complete") {
  //     onPageLoad();
  //   } else {
  //     window.addEventListener("load", onPageLoad, false);
  //     // Remove the event listener when component unmounts
  //     return () => window.removeEventListener("load", onPageLoad);
  //   }
  // }, []);

  return (
    <Swiper
      ref={swiperRef}
      className="w-full h-full erc-footer"
      modules={[Navigation, Pagination, Scrollbar, A11y, EffectCube, Autoplay]}
      spaceBetween={50}
      slidesPerView={3}
      navigation={{}}
      speed={500}
      pagination={{
        el: ".swiper-pagination",
        renderBullet,
        clickable: true,
        dynamicBullets: true,
      }}
      scrollbar={{ draggable: true, snapOnRelease: true }}
      transition
      effect={"cube"}
      cubeEffect={{
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      }}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide?.image}>
          {/* right */}
          <div className="swiper-inside-container">
            <div className="group flex flex-col w-1/2 opacity-[0.4] hover:opacity-[1] ">
              <img
                className="w-1/2 group-hover:scale-[120%] group-hover:mb-[20%] trans-all origin-top-left"
                src={slide?.biglogo}
                alt="img"
              />
              <p className="trans-all text-white text-sm">{slide?.subTitle}</p>
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
          <img
            src={slide?.image}
            id="bannerimg"
            className="h-full w-full"
            alt={slide?.title}
          />

          <SamVid vSrc={slide?.videoSrc} vType={slide?.VideoType} />
        </SwiperSlide>
      ))}

      {/* <!-- Add Pagination --> */}
      <div class="swiper-pagination"></div>
    </Swiper>
  );
};
