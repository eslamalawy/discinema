import { Avatar, Typography } from "@material-tailwind/react";
import { StarIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import React from "react";

export default function ReviewCard({ review }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Avatar
          crossOrigin="anonymous"
          src={`${process.env.REACT_APP_PUBLIC_IMG_URL}${review?.user.photo}`}
          alt={review?.user.name}
          size="sm"
        />
        <div className="flex flex-col">
          <Typography variant="small" color="white" className="font-normal">
            {review?.user.name} {" - "}
            {moment(review?.createdAt).format("D MMMM YYYY")}
          </Typography>
          <div className="flex gap-1">
            <StarIcon className="w-6 text-amber-600" />
            <Typography
              variant="small"
              color="white"
              className="mb-auto mt-auto font-normal"
            >
              {review?.rating}
            </Typography>
          </div>
        </div>
      </div>
      <hr className="mt-1" />
      <Typography
        variant="small"
        color="white"
        className="font-normal"
      >
        {review?.review}
      </Typography>
      <hr className="mt-1" />
    </div>
  );
}
