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
import { useLocation, useNavigate } from "react-router-dom";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { SamVid } from "./SampleVideojs/Sample";
import $ from "jquery";
import videojs from "video.js";

export const SliderVideo = ({ BannerSeries }) => {
  const navigateTo = useNavigate();
  const location = useLocation();
  // handel pagination Bullets to show the logo/
  const renderBullet = (index, className) => {
    const smalllogo = BannerSeries[index]?.bannerVideo[0]?.logo;
    return `<span class="${className}"><img src="${smalllogo}"/></span>`;
  };

  // voice handeling
  const [isMutedClicked, setIsMutedClicked] = useState(false);
  const toggleIsMutedClicked = () => setIsMutedClicked((val) => !val);
  const btn_mute = () => {
    //console.log("btn mute clicked");
    toggleIsMutedClicked();
  };

  // watch handeling
  const btn_watch = (slug) => {
    //console.log("btn watch clicked");
    navigateTo(`/series/${slug}`);
  };

  //handel video showing
  const VIDEO_PLAYING_STATE = {
    PLAYING: "PLAYING",
    PAUSE: "PAUSE",
  };
  const waiting = 3000;

  const rmv_class = (element, cls) => {
    $(element).removeClass(cls);
  };

  const add_class = (element, cls) => {
    $(element).addClass(cls);
  };

  const handelSlideOnChange = (
    swiperInstance,
    videoPlayStatus,
    timeout,
    new_timeout
  ) => {
    $("div#bannervideo").hide();
    $("img#bannerimg").show();

    const activeSlideIndex = swiperInstance.activeIndex;
    const activeSlide = swiperInstance.slides[activeSlideIndex];
    const myslide_data = BannerSeries[swiperInstance.activeIndex];
    const myimage_ref = activeSlide.querySelector(".swiper-slide #bannerimg");
    const myvideo_ref = activeSlide.querySelector(".swiper-slide #bannervideo");
    const myInsideContainer = activeSlide.querySelector(
      ".swiper-inside-container > div"
    );
    const containerImg = myInsideContainer.querySelector("img");
    const btnMute = activeSlide.querySelector(".btn_mute");
    const players = videojs.getAllPlayers();

    const monvideo = myvideo_ref.querySelector(".video-js");
    const monplayer = videojs.getPlayer(monvideo);

    // Pause the player when the user scrolls
    $(window).on("scroll", function () {
      if (this.scrollY === 0) {
        //console.log("asd called",location.pathname)
        if (location.pathname === "/" || location.pathname === "/home") {
          $(".navBar-itm").addClass("opacity-[0.5]");
        }
        try {
          players.map((player, index) => {
            player.pause();
          });
        } catch (err) {
          $(".navBar-itm").removeClass("opacity-[0.5]");
          //console.log(err);
        }

        swiperInstance.slideTo(0, 500);
      } else if (this.scrollY > swiperInstance.height / 2) {
        $(".navBar-itm").removeClass("opacity-[0.5]");
        try {
          players.map((player, index) => {
            player.pause();
            player.hide();
          });
        } catch (err) {
          //console.log(err);
        }
        $(myvideo_ref).hide();
        $(myimage_ref).show();
      }
    });

    //addding the url & poster to the video
    monplayer.poster(myslide_data?.images.posterWide[0].source);
    monplayer.src({
      src: myslide_data?.bannerVideo[0]?.vids[0]?.link,
      type: myslide_data?.bannerVideo[0]?.vids[0]?.mimeType,
    });

    monplayer.off("error");
    monplayer.off("ended");
    monplayer.off("loadedmetadata");

    monplayer.on("ended", () => {
      next();
      //console.log("MONPLAYER:", "player finished the video");
    });

    monplayer.on("loadedmetadata", () => {
      //console.log("MONPLAYER:", "player loaded the video");
    });

    monplayer.on("error", () => {
      next();
      //console.log("MONPLAYER:", "player cannot read video or Error occured");
    });

    if (myimage_ref && myvideo_ref) {
      $(myimage_ref).show();
      $(myvideo_ref).hide();

      //try to autoHover it
      add_class(myInsideContainer, "opacity-[1]");
      add_class(containerImg, "scale-[120%]");
      add_class(containerImg, "mb-[20%]");
      add_class(btnMute, "hidden");

      setTimeout(() => {
        rmv_class(myInsideContainer, "opacity-[1]");
        rmv_class(containerImg, "scale-[120%]");
        rmv_class(containerImg, "mb-[20%]");
        rmv_class(btnMute, "hidden");
        $(myimage_ref).hide();
        $(myvideo_ref).show();

        //checking other players
        try {
          players.map((player, index) => {
            if (!player.paused()) {
              //console.log(index, "player is working must stop it");
              player.pause();
            }
          });
        } catch (error) {
          //console.log(error);
        }
        monplayer.show();
        monplayer.play("unmuted");
        videoPlayStatus = VIDEO_PLAYING_STATE.PLAYING;
      }, waiting);
    }

    function prev() {
      swiperInstance.slidePrev();
    }

    function next() {
      add_class(myInsideContainer, "opacity-[1]");
      add_class(containerImg, "scale-[120%]");
      add_class(containerImg, "mb-[20%]");
      add_class(btnMute, "hidden");
      $(myimage_ref).show();
      $(myvideo_ref).hide();
      new_timeout = setTimeout(function () {
        swiperInstance.slideNext(500);
      }, waiting);
    }

    function runNext() {
      timeout = setTimeout(function () {
        if (videoPlayStatus !== VIDEO_PLAYING_STATE.PLAYING) {
          next();
        }
      }, waiting);
    }
    runNext();
  };

  //swiper events
  const swiperRef = useRef(null);
  useEffect(() => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      const players = videojs.getAllPlayers();
      let videoPlayStatus = VIDEO_PLAYING_STATE.PAUSE;
      let timeout = null;
      let new_timeout = null;
      let done_change = false;

      // swiperInstance.on("reachBeginning", function () {
      //   console.log("this2 first slide");
      // });

      swiperInstance.on("beforeSlideChangeStart", function () {
        try {
          players.map((player, index) => {
            player.pause();
            player.hide();
          });
        } catch (error) {
          //console.log(error);
        }
      });

      if (swiperInstance.activeIndex === 0 && !done_change) {
        //fire the event of slideChange once
        //console.log("im here on slide one");
        handelSlideOnChange(
          swiperInstance,
          videoPlayStatus,
          timeout,
          new_timeout
        );
        done_change = true;
      }

      //swiperInstance.on("slideChange", handelSlideOnChange);
      swiperInstance.on("slideChange", () => {
        try {
          players.map((player, index) => {
            player.pause();
            player.hide();
          });
        } catch (error) {
          //console.log(error);
        }
        handelSlideOnChange(
          swiperInstance,
          videoPlayStatus,
          timeout,
          new_timeout
        );
      });

      // swiperInstance.on("reachEnd", function () {
      //   console.log("this2 last slide");
      // });
    }
  }, [swiperRef]);

  //handel the volume
  useEffect(() => {
    const players = videojs.getAllPlayers();
    const activeIndex = swiperRef.current.swiper.activeIndex;
    const activePlayer = players[activeIndex];
    let old_time = activePlayer.currentTime();
    try {
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
      });
    } catch (error) {
      //console.log(error);
    }
  }, [isMutedClicked]);

  return (
    <Swiper
      ref={swiperRef}
      className="swiperVideo w-full h-full erc-footer"
      modules={[Navigation, Pagination, Scrollbar, A11y, EffectCube, Autoplay]}
      spaceBetween={50}
      slidesPerView={3}
      navigation={{}}
      speed={500}
      rewind={{}}
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
      {BannerSeries.map((serie) => (
        <SwiperSlide key={serie?._id}>
          {/* right */}
          <div className="swiper-inside-container">
            <div className="group flex flex-col w-1/2 opacity-[0.4] hover:opacity-[1] ">
              <img
                className="w-1/2 group-hover:scale-[120%] group-hover:mb-[20%] trans-all origin-top-left"
                src={serie?.bannerVideo[0]?.logo}
                alt="img"
              />
              <p className="trans-all text-white text-sm">
                {serie?.description}
              </p>
              <button
                onClick={() => {
                  btn_watch(serie?.slug);
                }}
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
              className="btn_mute flex items-center justify-center rounded-full hover:bg-[#da0e5c] bg-[#0c0c0c60] text-white p-2 border border-[#da0e5c]"
            >
              {isMutedClicked ? (
                <SpeakerWaveIcon className="h-6 w-6" />
              ) : (
                <SpeakerXMarkIcon className="h-6 w-6" />
              )}
            </button>
          </div>
          <img
            src={serie?.images.posterWide[0].source}
            id="bannerimg"
            className="h-full w-full"
            alt={serie?.name}
          />

          <SamVid
            vSrc={serie?.bannerVideo[0]?.vids[0]?.link}
            vType={serie?.bannerVideo[0]?.vids[0]?.mimeType}
          />
        </SwiperSlide>
      ))}

      {/* <!-- Add Pagination --> */}
      <div class="swiper-pagination"></div>
    </Swiper>
  );
};

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
