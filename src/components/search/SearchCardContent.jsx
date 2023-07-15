import React, { useEffect, useState, useRef, useContext } from "react";
import "./style.css";
import { StarIcon, PlusIcon } from "@heroicons/react/24/solid";
import { PlayIcon } from "@heroicons/react/24/outline";
import $ from "jquery";
import { truncateString } from "../../utils";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@material-tailwind/react";
import RaiseAlert2 from "../Alerts/RaiseAlert2";
import { CWatchlistAPI } from "../../API/CWatchlistAPI";
import { MainContext } from "../../context/MainContext";

export default function SearchCardContent(props) {
  const { user } = useContext(MainContext);
  const { color, serie } = props;
  const headingRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  const handelAddWatchList = async (series_id) => {
    if (series_id && user) {
      const res = await CWatchlistAPI.CreateWatchlist(series_id);
      // console.log(res);
      if (res?.status === "success") {
        setStatus(res.status);
        setMessage("Added Successfully!");
        setshowAlert(true);
      } else {
        setStatus(res.status);
        setMessage(res.message);
        setshowAlert(true);
      }
    } else {
      setStatus("fail");
      setMessage("login first!");
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
  const trancatedStr = truncateString(serie?.description, 100);
  const navigateTo = useNavigate();

  return (
    <div
      className="relative"
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
            <p className=" opacity-1 text-center">{serie?.name}</p>
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

              <div className="flex">
                <p className="text-sm">Genres: </p>
                {serie?.genres.map((genre) => {
                  return (
                    <p className="text-sm bg-blue-gray-700 border rounded ml-1">
                      &#xA0;{genre}&#xA0;
                    </p>
                  );
                })}
              </div>

              <Tooltip content={serie?.description}>
                <p className="mt-1 text-xs text-left">{trancatedStr}</p>
              </Tooltip>
            </div>
          </div>
          <div className="text-white min-h-[15%] bg-black flex items-center justify-evenly">
            {showAlert && <RaiseAlert2 state={status} message={message} />}
            <Tooltip content="Add To WatchList">
              <a
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handelAddWatchList(serie?._id);
                }}
              >
                <PlusIcon className="w-7 text-amber-600" />
              </a>
            </Tooltip>
            <Tooltip content="Watch">
              <a
                className="cursor-pointer"
                onClick={() => {
                  navigateTo(`/series/${serie?.slug}`);
                }}
              >
                <PlayIcon className="w-7 text-amber-600" />
              </a>
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col">
          <img
            src={serie?.images.posterWide[0].source}
            alt={serie?.name}
            loading="lazy"
            className="w-full object-cover"
          />
          <div className="flex flex-col items-start">
            <p ref={headingRef} className="text-sm font-bold">
              {serie?.name}
            </p>
            <p className="text-sm text-gray-600">Sub - Arabic</p>
          </div>
        </div>
      </a>
    </div>
  );
}
