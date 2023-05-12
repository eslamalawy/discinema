import { Route, Routes, Navigate } from "react-router-dom";
import MyNavbar from "./layouts/NavBar/MyNavbar";
import Footer from "./layouts/Footer";

function App() {
  return (
    <div className="flex flex-col h-screen">
       <MyNavbar />
      <h1 className="text-7xl mr-0 text-green-700">Hello TailWend CSS</h1>
      <Footer/>
    </div>
  );
}

export default App;

// in tailwend for footer
// html,body,root [in public/index.html] class [h-screen]
// div of app [the container] take [flex flex-col h-screen]
// footer take [mt-auto]