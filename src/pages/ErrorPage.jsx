import React from "react";
import PaddingTop from "../components/PaddingTop";
import ErrorImg from "../Error.gif";
export default function ErrorPage() {
  return (
    <div>
      <PaddingTop />

      <div className="h-screen flex items-center justify-center">
        <div className="h-1/2 w-1/2" >
          <img src={ErrorImg} />
        </div>
      </div>
    </div>
  );
}
