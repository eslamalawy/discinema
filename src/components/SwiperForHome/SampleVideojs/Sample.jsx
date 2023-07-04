import React from "react";
//import videojs from "video.js";
// This imports the functional component from the previous sample.
import VideoJS from "./VideoJS";

export const SamVid = ({vSrc,vType}) => {
  //const playerRef = React.useRef(null);
  const videoJsOptions = {
    // autoplay: 'muted',
    //controls: true,
    responsive: true,
    // fluid: true,
    sources: [
      {
        src: vSrc,
        type: vType,
      },
    ],
  };

  // const handlePlayerReady = (player) => {
  //   playerRef.current = player;
  //   // You can handle player events here, for example:
  //   player.on("waiting", () => {
  //     videojs.log("player is waiting");
  //   });
  //   player.on("dispose", () => {
  //     videojs.log("player will dispose");
  //   });
  //   player.on("ended", () => {
  //     videojs.log("player finished the video");
  //   });
  //   player.on("loadedmetadata", ()=>{
  //       videojs.log("player loaded the video");
  //   })
  //   player.on("error", ()=>{
  //       videojs.log("player cannot read video or Error occured");
  //   })
  // };

  return (
    <>
      <VideoJS options={videoJsOptions} />
      {/* <VideoJS options={videoJsOptions} onReady={handlePlayerReady} /> */}
    </>
  );
};
