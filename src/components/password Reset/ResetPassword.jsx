import React, { useRef, useEffect, useState } from "react";
import PaddingTop from "../PaddingTop";
import { Button, Input, Typography } from "@material-tailwind/react";
import RaiseAlert2 from "../Alerts/RaiseAlert2";
import { validateEmail } from "../../utils";
import { UserAPI } from "../../API/UserAPI";

export default function ResetPassword() {
  const emailRef = useRef(null);
  const [error, setError] = useState(null);
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  const btnSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.children[0].value;

    if (email && !error) {
      console.log("axho", email);
      const res = await UserAPI.ForgetPassword(email);
      console.log(res);
      if (res?.status === "success") {
        setStatus(res.status);
        setMessage(`${res.message}`);
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
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <PaddingTop />
      <Typography className="text-center" variant="h3" color="blue">
        Reset Your Account Password
      </Typography>
      <p>Please Enter your Account Email Address</p>
      <form className="w-1/4">
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
        {error && <div className="text-red-500">{error}</div>}
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
