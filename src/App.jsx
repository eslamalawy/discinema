import { Route, Routes, Navigate } from "react-router-dom";
import MyNavbar from "./layouts/NavBar/MyNavbar";
import Footer from "./layouts/Footer";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <MyNavbar />
      <div
        id="overlay-elements"
        className=" fixed overflow-hidden z-10 bg-gray-900 bg-opacity-[0.65] inset-0 transform ease-in-out hidden"
      ></div>
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>

      <Footer />
    </div>
  );
}

export default App;

// in tailwend for footer
// html,body,root [in public/index.html] class [h-screen]
// div of app [the container] take [flex flex-col h-screen]
// footer take [mt-auto]
