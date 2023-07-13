import React, { useContext, useEffect, useState, useRef } from "react";
import { MainContext } from "../../context/MainContext";
import {
  Input,
  Typography,
  Card,
  Avatar,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { UserAPI } from "../../API/UserAPI";
import RaiseAlert2 from "../Alerts/RaiseAlert2";

export default function ProfilePassword() {
  const { setUser, user } = useContext(MainContext);
  const [userImg, setUserImg] = useState(null);
  const navigateTo = useNavigate();
  const navigate = (url) => {
    navigateTo(url);
  };
  const currentPWRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCRef = useRef(null);
  const [errorPw, setErrorPw] = useState(null);
  const [errorPwC, setErrorPwC] = useState(null);

  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setUserImg(`${process.env.REACT_APP_PUBLIC_IMG_URL}${user.photo}`);
    }
  }, []);

  const btnSubmit = async (e) => {
    e.preventDefault();

    const passwordCurrent = currentPWRef.current.children[0].value;
    const password = passwordRef.current.children[0].value;
    const passwordConfirm = passwordCRef.current.children[0].value;

    if (
      passwordCurrent &&
      password &&
      passwordConfirm &&
      !errorPw &&
      !errorPwC
    ) {
      
      const res = await UserAPI.updateSettings(
        { passwordCurrent, password, passwordConfirm },
        "password"
      );

      if (res?.status === "success") {
        setStatus(res.status);
        setMessage("Password Updated Successfully!");
        setUser(res.data.user);
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
      };
    }
  }, [showAlert]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card color="transparent" shadow={false}>
        <Typography className="text-center" variant="h3" color="blue">
          Your Account Settings
        </Typography>

        <div className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-4 flex flex-col gap-6">
            <div className="text-center">
              <Avatar
                variant="circular"
                alt="user image"
                className="border border-blue-500 p-0.5 w-[50%] h-[50%]"
                src={userImg}
                crossOrigin="anonymous"
              />
              <Typography className="mt-3 mb-3" variant="h5" color="blue">
                Change Your Password
              </Typography>
            </div>
            <Input
              ref={currentPWRef}
              type="password"
              size="lg"
              label="Current Password"
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

                if (e.target.value === passwordCRef.current.children[0].value) {
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
                if (e.target.value === passwordRef.current.children[0].value) {
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

            {errorPw && <div className="text-red-500">{errorPw}</div>}
            {errorPwC && <div className="text-red-500">{errorPwC}</div>}
            {showAlert && <RaiseAlert2 state={status} message={message} />}
            <Button type="submit" onClick={btnSubmit} fullWidth>
              Change Password
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
