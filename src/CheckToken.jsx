import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "./context/MainContext";
import { doesHttpOnlyCookieExist } from "./utils";
import { Spinner,Typography } from "@material-tailwind/react";
import { UserAPI } from "./API/UserAPI";
import App from "./App";

export default function CheckToken() {
  const { setUser, user } = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jwtExist = doesHttpOnlyCookieExist("jwt");
    if (jwtExist) {
      async function fetchUser() {
        const res = await UserAPI.Me();
        if (res?.status === "success") {
          setUser(res.data.data);
        }
        setIsLoading(false);
      }

      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    // Show a loading spinner or placeholder while fetching the user data
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div>
          <Spinner className="h-16 w-16" color="purple" />
        </div>
        <Typography className="text-center mt-2 changa-one" variant="h3" color="blue">
          Welcome to DisCinema
        </Typography>

        <Typography className="text-center mt-2" variant="h5">
          Loading...
        </Typography>

      </div>
    );
  }

  return <App />;
}
