import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import { StarIcon, PlusIcon } from "@heroicons/react/24/solid";
import { PlayIcon } from "@heroicons/react/24/outline";
import $ from "jquery";
import { truncateString } from "../../utils";

export default function CardContent(props) {
  const { color } = props;
  const headingRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (color && headingRef) {
      const txtInstance = headingRef.current;
      $(txtInstance).css("color", color);
    }
  }, [color, headingRef]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  let str =
    "One Piece is the story of Monkey D. Luffy who became a rubber man after accidently eating a Devil Fruit. In his quest, Luffy builds his crew and continues on his adventure to find the mysterious treasure One Piece.";
  const trancatedStr = truncateString(str, 230);

  return (
    <div
      className="mt-5 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a href="/bungo-stary">
        <div
          className={`contenthidden ${
            isHovered ? "fade-in" : ""
          } absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-80`}
        >
          <div className="flex flex-col text-white mt-1 min-h-[85%]">
            <p className=" opacity-1">Bungo Stray Dogs</p>
            <div className="flex justify-center">
              <StarIcon className="w-6 text-amber-600" />
              <p className="mt-auto font-bold">4.5</p>
              <p className="mt-auto ">&#xA0;(15156)</p>
            </div>

            <div className="flex flex-col pl-2 items-start mt-2">
              <div className="flex">
                <p className="font-bold">5</p>
                <p className="text-sm text-">&#xA0;Seasons</p>
              </div>
              <div className="flex">
                <p className="font-bold">59</p>
                <p className="text-sm">&#xA0;Episodes</p>
              </div>

              <p className="mt-1 text-xs text-left">{trancatedStr}</p>
            </div>
          </div>
          <div className="text-white min-h-[15%] bg-black flex items-center justify-evenly">
            <a href="/add/watchlist">
              <PlusIcon className="w-7 text-amber-600" />
            </a>
            <a href="/watch/firstep">
              <PlayIcon className="w-7 text-amber-600" />
            </a>
          </div>
        </div>
        <div className="flex flex-col ">
          <img
            src="https://www.crunchyroll.com/imgsrv/display/thumbnail/240x360/catalog/crunchyroll/f97923c80c70c98675c4f66ddb6c3782.jpe"
            alt="Bungo Stray Dogs"
            loading="lazy"
            className="h-[266px] w-[170px]"
          />
          <div className="flex flex-col items-start">
            <p ref={headingRef} className="text-sm font-bold">
              Bungo Stray Dogs
            </p>
            <p className="text-sm text-gray-600">Sub - Arabic</p>
          </div>
        </div>
      </a>
    </div>
  );
}
