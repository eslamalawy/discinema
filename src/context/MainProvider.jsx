import React, { useState } from "react";
import { MainContext } from "./MainContext";

export default function MainProvider(props) {
  //login token
  const [user, setUser] = useState(null);
  const [reply, setReply] = useState(null);
  const [comment, setComment] = useState(null);
  const [review, setReview] = useState(null);

  //returning values
  let myval = {
    user,
    setUser,
    reply,
    setReply,
    comment,
    setComment,
    review,
    setReview,
  };

  return (
    <MainContext.Provider value={myval}>{props.children}</MainContext.Provider>
  );
}
