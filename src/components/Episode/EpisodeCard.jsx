import React, { useEffect, useState, useRef } from "react";
import { PlayIcon } from "@heroicons/react/24/outline";
import $ from "jquery";
import { truncateString } from "../../utils";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@material-tailwind/react";

export default function EpisodeCard(props) {
  const { color, episode } = props;
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
  const trancatedStr = truncateString(episode?.summary, 100);
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
          navigateTo(`/episode/${episode?.slug}`);
        }}
      >
        <div
          className={`contenthidden ${
            isHovered ? "fade-in" : ""
          } absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-80`}
        >
          <div className="flex flex-col text-white mt-1 min-h-[80%]">
            <p className="text-sm font-bold opacity-1 text-center">
              {episode?.name}
            </p>

            <div className="flex flex-col pl-2 items-start mt-2">
              <div className="flex">
                <p className="font-bold">{episode?.commentsCount}</p>
                <p className="text-sm text-">&#xA0;Comments</p>
              </div>
              <div className="flex">
                <p className="text-sm">Status: </p>
                {episode?.filler ? (
                  <p className="text-sm">&#xA0;Filler</p>
                ) : (
                  <p className="text-sm">&#xA0;Have Content</p>
                )}
              </div>

              <div className="flex">
                <p className="text-sm">Sequance: </p>
                <p className="text-sm">&#xA0;{episode?.sequenceNumber}</p>
              </div>

              <Tooltip content={episode?.summary}>
                <p className="mt-1 text-xs text-left">{trancatedStr}</p>
              </Tooltip>
            </div>
          </div>
          <div className="text-white min-h-[20%] bg-black flex items-center justify-evenly">
          <Tooltip content="Watch">
            <a
              className="cursor-pointer"
              onClick={() => {
                navigateTo(`/episode/${episode?.slug}`);
              }}
            >
              <PlayIcon className="w-7 text-amber-600" />
            </a>
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col">
          <img
            src={episode?.images.thumbnail[0].source}
            alt={episode?.name}
            loading="lazy"
            className="w-full object-cover"
          />
          <div className="flex flex-col items-start">
            <p ref={headingRef} className="text-sm font-bold">
              EP{episode?.number} - {episode?.name}
            </p>
            <p className="text-sm text-gray-600">Sub - Arabic</p>
          </div>
        </div>
      </a>
    </div>
  );
}
