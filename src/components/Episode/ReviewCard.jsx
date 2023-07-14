import {
  Avatar,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Rating,
  Textarea,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import { StarIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MainContext } from "../../context/MainContext";
import RaiseAlert2 from "../Alerts/RaiseAlert2";
import { CReviewsAPI } from "../../API/CReviewsAPI";

export default function ReviewCard({ review }) {
  const { user, setReview } = useContext(MainContext);
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [DialogTitle, SetDialogTitle] = useState(null);
  const [DialogId, SetDialogId] = useState(null);
  const [DialogReview, SetDialogReview] = useState(null);
  const [DialogRate, SetDialogRate] = useState(null);
  const [DialogAction, SetDialogAction] = useState(null);
  const handleOpen = (title, id, review, rate, action) => {
    setOpen(!open);
    SetDialogTitle(title);
    SetDialogId(id);
    SetDialogReview(review);
    SetDialogRate(rate);
    SetDialogAction(action);
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

  const handelDialogConfirm = async () => {
    if (user) {
      if (DialogAction == "delete") {
        const res = await CReviewsAPI.DeleteReview(DialogId);
        if (!res) {
          setMessage("Review Deleted Successfully!");
          setStatus("success");
          setshowAlert(true);
          setReview(Date.now());
        } else {
          setStatus(res?.status);
          setMessage(res?.message);
          setshowAlert(true);
        }
      } else if (DialogAction == "edit") {
        const res = await CReviewsAPI.UpdateReview(
          DialogId,
          DialogReview,
          DialogRate
        );
        if (res?.status == "success") {
          setMessage("Review Updated Successfully!");
          setStatus(res?.status);
          setshowAlert(true);
          setReview(Date.now());
        } else {
          setStatus(res?.status);
          setMessage(res?.message);
          setshowAlert(true);
        }
      }
    } else {
      setStatus("fail");
      setMessage("You Should Login first");
      setshowAlert(true);
    }
    setOpen(!open);
  };
  return (
    <div>
      {showAlert && <RaiseAlert2 state={status} message={message} />}

      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>{DialogTitle}</DialogHeader>
        <DialogBody divider>
          <div className=" flex flex-col gap-3">
            <Textarea
              onChange={(e) => {
                SetDialogReview(e.target.value);
              }}
              value={DialogReview}
              label="Review"
            />

            <div className="flex items-center gap-2">
              <Rating
                value={DialogRate}
                onChange={(value) => SetDialogRate(value)}
              />
              <Typography color="black" className="font-bold">
                {DialogRate}.0 Rated
              </Typography>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handelDialogConfirm}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>

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
            <div>
              {review?.user._id === user?._id ? (
                <div>
                  <Tooltip content="Edit Review">
                    <IconButton
                      onClick={() => {
                        handleOpen(
                          "Edit Review",
                          review?._id,
                          review?.review,
                          review?.rating,
                          "edit"
                        );
                      }}
                      variant="text"
                      color="blue-gray"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Delete Review">
                    <IconButton
                      onClick={() => {
                        handleOpen(
                          "Delete Review",
                          review?._id,
                          review?.review,
                          review?.rating,
                          "delete"
                        );
                      }}
                      variant="text"
                      color="red"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      <hr className="mt-1" />
      <Typography variant="small" color="white" className="font-normal">
        {review?.review}
      </Typography>
      <hr className="mt-1" />
    </div>
  );
}
