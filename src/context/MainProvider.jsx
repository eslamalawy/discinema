import React, { useState } from "react";
import { MainContext } from "./MainContext";

export default function MainProvider(props) {
  //login token
  const [user, setUser] = useState(null);

  //returning values
  let myval = {
    user,
    setUser,
  };

  return (
    <MainContext.Provider value={myval}>{props.children}</MainContext.Provider>
  );
}
