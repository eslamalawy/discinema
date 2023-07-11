import React, { useContext, useEffect, useState, useRef } from "react";
import { MainContext } from "../../context/MainContext";
import {
  Input,
  Typography,
  Card,
  Avatar,
  Button,
} from "@material-tailwind/react";
import { validateEmail } from "../../utils";
import { useNavigate } from "react-router-dom";
import { UserAPI } from "../../API/UserAPI";
import RaiseAlert2 from "../Alerts/RaiseAlert2";

export default function ProfileEdit() {
  const { setUser, user } = useContext(MainContext);
  const [userImg, setUserImg] = useState(null);
  const navigateTo = useNavigate();
  const navigate = (url) => {
    navigateTo(url);
  };
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const fileRef = useRef(null);
  const [error, setError] = useState(null);
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setUserImg(`${process.env.REACT_APP_PUBLIC_IMG_URL}${user.photo}`);
      emailRef.current.children[0].value = user?.email;
      nameRef.current.children[0].value = user?.name;
    }
  }, []);

  const btnSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.children[0].value;
    const name = nameRef.current.children[0].value;
    const photo = fileRef.current.files[0];

    if (email && name && !error) {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      if (photo) {
        form.append("photo", photo);
      }
      const res = await UserAPI.updateSettings(form, "data");
      if (res?.status === "success") {
        setStatus(res.status);
        setMessage("Account Data Updated Successfully!");
        setUser(res.user);
        setUserImg(`${process.env.REACT_APP_PUBLIC_IMG_URL}${res.user.photo}`);
        setshowAlert(true);
      } else if (res?.status != "success") {
        setStatus(res.status);
        setMessage(res.message);
        setshowAlert(true);
      }
    }
  };
  const btnDelete = async () => {
    const res = await UserAPI.DeleteUser();

    if (!res) {
      setMessage("User Deleted Successfully!");
      setStatus("success");
      setshowAlert(true);
      setUser(null);
    } else {
      setStatus(res?.status);
      setMessage(res?.message);
      setshowAlert(true);
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
                alt="candice wu"
                className="border border-blue-500 p-0.5 w-[50%] h-[50%]"
                src={userImg}
                crossOrigin="anonymous"
              />
              <Typography className="mt-3 mb-3" variant="h5" color="blue">
                Choose a new photo
              </Typography>
              <input
                ref={fileRef}
                className={
                  "w-full cursor-pointer file:bg-violet-50 file:text-violet-500 hover:file:bg-violet-100 file:rounded-lg file:rounded-tr-none file:rounded-br-none file:px-4 file:py-2 file:mr-4 file:border-none hover:cursor-pointer border rounded-lg text-gray-400"
                }
                type="file"
                accept="image/*"
                id="photo"
                name="photo"
              />
            </div>
            <Input
              ref={nameRef}
              size="lg"
              label="Name"
              placeholder={user?.name}
            />
            <Input
              ref={emailRef}
              onChange={(e) => {
                if (validateEmail(e.target.value)) {
                  setError(false);
                } else {
                  setError("Write Suitable Email Address!");
                }
              }}
              size="lg"
              label="Email"
              placeholder={user?.email}
            />
            {error && <div className="text-red-500">{error}</div>}
            {showAlert && <RaiseAlert2 state={status} message={message} />}
            <Button type="submit" onClick={btnSubmit} fullWidth>
              Save Changes
            </Button>
          </div>

          <div className=" mt-2 ">
            <Typography className="text-center mb-2" variant="h3" color="blue">
              Delete your account?
            </Typography>

            <Button color="red" type="submit" onClick={btnDelete} fullWidth>
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
