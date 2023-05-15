import React from "react";
import videojs from "video.js";
// This imports the functional component from the previous sample.
import VideoJS from "./VideoJS";

export const SamVid = () => {
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: 'muted',
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "https://file-examples.com/storage/fe59cbbb63645c19f9c3014/2017/04/file_example_MP4_640_3MG.mp4",
        type: "video/mp4",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
    player.on("ended", () => {
      videojs.log("player finished the video");
    });
    player.on("loadedmetadata", ()=>{
        videojs.log("player loaded the video");
        playerRef.current.pause();
    })
    player.on("error", ()=>{
        videojs.log("player cannot read video or Error occured");
    })
    //Player.muted(true);
    
  };

  return (
    <>
      <div>Rest of app here</div>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      <div>Rest of app here</div>
    </>
  );
};
