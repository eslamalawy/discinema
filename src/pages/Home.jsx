import React from "react";
import Example from "../components/Drawer/Example";
import slides from "../components/SwiperVideo/mock.json";
import { SliderVideo } from "../components/SwiperVideo/slidervideo";
import SwiperAuto from "../components/SwiperContent/SwiperAuto";

export default function Home() {
  return (
    <div>
      <div className="h-screen">
        <SliderVideo slides={slides} />
      </div>

      <h1 className="text-7xl mr-0 text-green-700">Hello TailWend CSS</h1>

      <SwiperAuto />
      <Example />
    </div>
  );
}
