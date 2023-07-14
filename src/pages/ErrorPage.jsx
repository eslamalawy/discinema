import React from "react";
import PaddingTop from "../components/PaddingTop";
import ErrorImg from "../Error.gif";
export default function ErrorPage() {
  return (
    <div>
      <PaddingTop />

      <div className="h-[50vh] flex items-center justify-center">
        <div>
          <img style={{ height: 380 }} src={ErrorImg} />
        </div>
      </div>
    </div>
  );
}
