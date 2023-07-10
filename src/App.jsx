import { Route, Routes, Navigate } from "react-router-dom";
import MyNavbar from "./layouts/NavBar/MyNavbar";
import Footer from "./layouts/Footer";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MePage from "./pages/MePage";
import Profile from "./components/profile/Profile";
import ProfileEdit from "./components/profile/ProfileEdit";
import ProfilePassword from "./components/profile/ProfilePassword";
import ResetPassword from "./components/password Reset/ResetPassword";
import ResetPwToken from "./components/password Reset/ResetPwToken";

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
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="resetpassword" element={<ResetPassword />} />
        <Route path="resetpassword/:id" element={<ResetPwToken />} />

        <Route path="me" element={<MePage />}>
          <Route path="" element={<Profile />} />
          <Route path="edit" element={<ProfileEdit />} />
          <Route path="password" element={<ProfilePassword />} />
        </Route>

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
