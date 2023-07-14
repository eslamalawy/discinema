import React from "react";
import $ from "jquery";

export default function PaddingTop() {
  $(".navBar-itm").removeClass("opacity-[0.5]");
  window.removeEventListener("scroll",()=>{});
  return <div className="pt-[3.5rem]"></div>;
}
