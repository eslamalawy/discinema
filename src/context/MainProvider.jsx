import React, {useState}from 'react'
import { MainContext } from './MainContext'

export default function MainProvider(props) {
  // const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  // const [VideoPlayer, setVideoPlayer] = useState(null);

  // const ReturnValue = {
  //   ""
  // }

  return (
    <MainContext.Provider value={""}>{props.children}</MainContext.Provider>
  )
}
