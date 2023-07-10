import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PaddingTop from "../PaddingTop";
import { Input, Button, Typography } from "@material-tailwind/react";
import RaiseAlert2 from "../Alerts/RaiseAlert2";
import { UserAPI } from "../../API/UserAPI";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "../../context/MainContext";

export default function ResetPwToken() {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const { setUser } = useContext(MainContext);
  const passwordRef = useRef(null);
  const passwordCRef = useRef(null);
  const [Logged, setLogged] = useState(false);
  const [errorPw, setErrorPw] = useState(null);
  const [errorPwC, setErrorPwC] = useState(null);
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  const btnSubmit = async (e) => {
    e.preventDefault();
    const password = passwordRef.current.children[0].value;
    const passwordConfirm = passwordCRef.current.children[0].value;

    if (password && passwordConfirm && !errorPw && !errorPwC) {
      console.log(password, passwordConfirm);

      const res = await UserAPI.ResetPassword(id, password, passwordConfirm);
      console.log(res);
      if (res?.status === "success") {
        setStatus(res.status);
        setMessage(`Password Successfully Updated`);
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
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <PaddingTop />
      <Typography className="text-center" variant="h3" color="blue">
        Reset Your Account Password
      </Typography>
      <p>Please Enter New Password</p>
      <form className="w-1/4 gap-3 flex flex-col">
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
        <Button
          className="mt-5 w-full"
          type="submit"
          onClick={btnSubmit}
          fullWidth
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}
