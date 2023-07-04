import { Route, Routes, Navigate } from "react-router-dom";
import MyNavbar from "./layouts/NavBar/MyNavbar";
import Footer from "./layouts/Footer";
import Example from "./components/Drawer/Example";
import slides from "./components/SwiperForHome/mock.json"
import { SliderVideo } from "./components/SwiperForHome/slidervideo";


function App() {
  return (
    <div className="flex flex-col h-screen">
      <MyNavbar />
      <div
        id="overlay-elements"
        className=" fixed overflow-hidden z-10 bg-gray-900 bg-opacity-[0.65] inset-0 transform ease-in-out hidden"
      ></div>
      {/* <div className="pt-[3.5rem]"></div> */}
      <SliderVideo slides={slides}/>
      <h1 className="text-7xl mr-0 text-green-700">Hello TailWend CSS</h1>

      <Example />
      <Footer />
    </div>
  );
}

export default App;

// in tailwend for footer
// html,body,root [in public/index.html] class [h-screen]
// div of app [the container] take [flex flex-col h-screen]
// footer take [mt-auto]
