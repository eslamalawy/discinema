import React, { useContext, useEffect } from "react";
import { MainContext } from "../../context/MainContext";
import { Input, Typography, Card, Avatar } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useContext(MainContext);
  const navigateTo = useNavigate();
  const navigate = (url) => {
    navigateTo(url);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card color="transparent" shadow={false}>
        <Typography className="text-center" variant="h3" color="blue">
          Your Account Information
        </Typography>

        <div className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <form className="mb-4 flex flex-col gap-6">
            <div className="text-center">
              <Avatar
                variant="circular"
                alt="candice wu"
                className="border border-blue-500 p-0.5 w-[50%] h-[50%]"
                src={`${process.env.REACT_APP_PUBLIC_IMG_URL}${user?.photo}`}
                crossOrigin="anonymous"
              />
            </div>

            <div>
              <Typography color="gray" className="font-bold">
                Name
              </Typography>
              <Input size="lg" label="Name" disabled value={user?.name} />
            </div>

            <div>
              <Typography color="gray" className="font-bold">
                Email
              </Typography>
              <Input size="lg" label="Email" disabled value={user?.email} />
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
