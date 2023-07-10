import React, { useRef, useState, useEffect } from "react";
import PaddingTop from "../components/PaddingTop";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils";
import { UserAPI } from "../API/UserAPI";
import { useContext } from "react";
import { MainContext } from "../context/MainContext";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import RaiseAlert2 from "../components/Alerts/RaiseAlert2";

export default function Login() {
  const navigateTo = useNavigate();
  const { setUser } = useContext(MainContext);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState(null);
  const [Logged, setLogged] = useState(false);
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  const btnSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.children[0].value;
    const password = passwordRef.current.children[0].value;
    if (email && password && !error) {
      const res = await UserAPI.Login(email, password);

      if (res?.status === "success") {
        setStatus(res.status);
        setMessage(`${res.data.user.name} Successfully Login!`);
        setUser(res.data.user);
        setLogged(true);
        setshowAlert(true);
      } else if (res?.status != "success") {
        setStatus(res.status);
        setMessage(res.message);
        setshowAlert(true);
      }
    }
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setshowAlert(false);
      }, 2400);
      return () => {
        clearTimeout(timer);
        if (Logged) {
          navigateTo("/home");
        }
      };
    }
  }, [showAlert]);

  return (
    <div>
      <PaddingTop />
      <div className="flex flex-col justify-center items-center mt-10">
        <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="blue-gray">
            Login
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Enter your details to login.
          </Typography>
          <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
            <div className="mb-4 flex flex-col gap-6">
              <Input
                ref={emailRef}
                onChange={(e) => {
                  if (validateEmail(e.target.value)) {
                    e.target.setAttribute("success", "");
                    setError(false);
                  } else {
                    e.target.setAttribute("error", "");
                    setError("Write Suitable Email Address!");
                  }
                }}
                size="lg"
                name="email"
                type="email"
                label="Email"
                required
              />
              <Input
                ref={passwordRef}
                name="password"
                type="password"
                size="lg"
                label="Password"
                required
              />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {/* {showAlert && <RaiseAlert state={status} message={message} />} */}
            {showAlert && <RaiseAlert2 state={status} message={message} />}
            <Button
              type="submit"
              className="mt-6"
              fullWidth
              onClick={btnSubmit}
            >
              Login
            </Button>

            <Typography color="gray" className="mt-4 font-normal">
              Don't have an account?{" "}
              <a
                onClick={() => navigateTo("/signup")}
                className="font-medium cursor-pointer text-blue-500 transition-colors hover:text-blue-gray-900"
              >
                Sign Up
              </a>
            </Typography>
            <Typography color="gray" className="mt-4 font-normal">
             Forgot your password?{" "}
              <a
                onClick={() => navigateTo("/resetpassword")}
                className="font-medium cursor-pointer text-blue-500 transition-colors hover:text-blue-gray-900"
              >
                Reset it
              </a>
            </Typography>
            
          </form>
        </Card>
      </div>
    </div>
  );
}
