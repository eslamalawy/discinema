import React, { useRef, useState ,useEffect} from "react";
import PaddingTop from "../components/PaddingTop";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils";
import { MainContext } from "../context/MainContext";
import { useContext } from "react";
import {
  Card,
  Input,
  // Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { UserAPI } from "../API/UserAPI";
import RaiseAlert2 from "../components/Alerts/RaiseAlert2";

export default function SignUp() {
  const navigateTo = useNavigate();
  const { setUser } = useContext(MainContext);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCRef = useRef(null);

  const [error, setError] = useState(null);
  const [errorPw, setErrorPw] = useState(null);
  const [errorPwC, setErrorPwC] = useState(null);
  const [Logged, setLogged] = useState(false);
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  const btnSubmit = async (e) => {
    e.preventDefault();
    //console.log("Clicked");
    const email = emailRef.current.children[0].value;
    const password = passwordRef.current.children[0].value;
    const passwordConfirm = passwordCRef.current.children[0].value;
    const name = nameRef.current.children[0].value;

    if (
      email &&
      password &&
      name &&
      passwordConfirm &&
      !error &&
      !errorPw &&
      !errorPwC
    ) {
      if (password === passwordConfirm) {
        const res = await UserAPI.SignUp(
          name,
          email,
          password,
          passwordConfirm
        );
        // console.log(res);
        if (res?.status === "success") {
          setStatus(res.status);
          setMessage("Account Created Successfully!");
          setUser(res.data.user);
          setLogged(true);
          setshowAlert(true);
        } else if (res?.status != "success") {
          setStatus(res.status);
          setMessage(res.message);
          setshowAlert(true);
        }
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
      <div className="flex flex-col justify-center items-center mt-5">
        <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="blue-gray">
            Sign Up
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Enter your details to register.
          </Typography>
          <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
            <div className="mb-4 flex flex-col gap-6">
              <Input
                ref={nameRef}
                size="lg"
                name="name"
                label="Name"
                required
              />
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
                label="Email"
                required
              />
              <Input
                ref={passwordRef}
                onChange={(e) => {
                  if (e.target.value.length >= 10) {
                    e.target.setAttribute("success", "");
                    setErrorPw(false);
                  } else {
                    e.target.setAttribute("error", "");
                    setErrorPw("Password must be >= 10 characters!");
                  }

                  if (
                    e.target.value === passwordCRef.current.children[0].value
                  ) {
                    setErrorPwC(false);
                  } else {
                    setErrorPwC("2 Passwords must be equal!");
                  }
                }}
                type="password"
                name="password"
                size="lg"
                required
                label="Password"
              />
              <Input
                ref={passwordCRef}
                onChange={(e) => {
                  if (
                    e.target.value === passwordRef.current.children[0].value
                  ) {
                    setErrorPwC(false);
                  } else {
                    setErrorPwC("2 Passwords must be equal!");
                  }
                }}
                type="password"
                name="passwordC"
                size="lg"
                required
                label="Password Confirm"
              />
            </div>
            {/* <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center font-normal"
                >
                  I agree the
                  <a
                    href="#"
                    className="font-medium transition-colors hover:text-blue-500"
                  >
                    &nbsp;Terms and Conditions
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            /> */}
            {error && <div className="text-red-500">{error}</div>}
            {errorPw && <div className="text-red-500">{errorPw}</div>}
            {errorPwC && <div className="text-red-500">{errorPwC}</div>}
            {showAlert && <RaiseAlert2 state={status} message={message} />}
            <Button
              type="submit"
              onClick={btnSubmit}
              className="mt-6"
              fullWidth
            >
              Register
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
              Already have an account?{" "}
              <a
                onClick={() => navigateTo("/login")}
                className="font-medium cursor-pointer text-blue-500 transition-colors hover:text-blue-gray-900"
              >
                Sign In
              </a>
            </Typography>
          </form>
        </Card>
      </div>
    </div>
  );
}
