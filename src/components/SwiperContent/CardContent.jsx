import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import { StarIcon, PlusIcon } from "@heroicons/react/24/solid";
import { PlayIcon } from "@heroicons/react/24/outline";
import $ from "jquery";
import { truncateString } from "../../utils";
import { useNavigate } from "react-router-dom";
import { Tooltip, Typography } from "@material-tailwind/react";

export default function CardContent(props) {
  const { color, serie } = props;
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

  const trancatedStr = truncateString(serie.description, 190);
  const navigateTo = useNavigate();
  return (
    <div
      className="mt-5 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        className="cursor-pointer"
        onClick={() => {
          navigateTo(`/series/${serie?.slug}`);
        }}
      >
        <div
          className={`contenthidden ${
            isHovered ? "fade-in" : ""
          } absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-80`}
        >
          <div className="flex flex-col text-white mt-1 min-h-[85%]">
            <p className=" opacity-1">{serie?.name}</p>
            <div className="flex justify-center">
              <StarIcon className="w-6 text-amber-600" />
              <p className="mt-auto font-bold">{serie?.ratingsAverage}</p>
              <p className="mt-auto ">&#xA0;({serie?.ratingsQuantity})</p>
            </div>

            <div className="flex flex-col pl-2 items-start mt-2">
              <div className="flex">
                <p className="font-bold">{serie?.seasonsCount}</p>
                <p className="text-sm text-">&#xA0;Seasons</p>
              </div>
              <div className="flex">
                <p className="text-sm">Status: </p>
                {serie?.isCompleted ? (
                  <p className="text-sm">&#xA0;Completed</p>
                ) : (
                  <p className="text-sm">&#xA0;not completed yet</p>
                )}
              </div>
              <div className="flex">
                <p className="text-sm">Year: </p>
                <p className="text-sm">&#xA0;{serie?.launchYear}</p>
              </div>
              <Tooltip content={serie?.description}>
                <p className="mt-1 text-xs text-left">{trancatedStr}</p>
              </Tooltip>
            </div>
          </div>
          <div className="text-white min-h-[15%] bg-black flex items-center justify-evenly">
            <a href="/add/watchlist">
              <PlusIcon className="w-7 text-amber-600" />
            </a>
            <a
              className="cursor-pointer"
              onClick={() => {
                navigateTo(`/series/${serie?.slug}`);
              }}
            >
              <PlayIcon className="w-7 text-amber-600" />
            </a>
          </div>
        </div>
        <div className="flex flex-col ">
          <img
            src={serie?.images.posterTall[0].source}
            alt={serie?.name}
            loading="lazy"
            className="h-[266px] w-[170px]"
          />
          <div className="flex flex-col items-start">
            <Typography ref={headingRef} className="text-sm font-bold">
              {serie?.name}
            </Typography>
            <p className="text-sm text-gray-600">Sub - Arabic</p>
          </div>
        </div>
      </a>
    </div>
  );
}
