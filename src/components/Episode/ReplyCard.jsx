import {
  Avatar,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Textarea,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../context/MainContext";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import RaiseAlert2 from "../Alerts/RaiseAlert2";
import { CReplyAPI } from "../../API/CReplyAPI";

export default function ReplyCard({ reply }) {
  const { user, setReply } = useContext(MainContext);
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  const [open, setOpen] = useState(false);
  const [DialogTitle, SetDialogTitle] = useState(null);
  const [DialogId, SetDialogId] = useState(null);
  const [DialogComment, SetDialogComment] = useState(null);
  const [DialogEpisode, SetDialogEpisode] = useState(null);
  const [DialogReply, SetDialogReply] = useState(null);

  const [DialogAction, SetDialogAction] = useState(null);
  const handleOpen = (title, id, reply, comment, episode, action) => {
    setOpen(!open);
    SetDialogTitle(title);
    SetDialogId(id);
    SetDialogReply(reply);
    SetDialogComment(comment);
    SetDialogEpisode(episode);
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
      if (DialogAction == "edit") {
        const res = await CReplyAPI.UpdateReply(DialogId, DialogReply);
        if (res?.status == "success") {
          setMessage("Reply Updated Successfully!");
          setStatus(res?.status);
          setReply(DialogReply);
          setshowAlert(true);
        } else {
          setStatus(res?.status);
          setMessage(res?.message);
          setshowAlert(true);
        }
      } else if (DialogAction == "delete") {
        const res = await CReplyAPI.DeleteReply(DialogId);
        if (!res) {
          setMessage("Reply Deleted Successfully!");
          setStatus("success");
          setshowAlert(true);
          setReply(Date.now());
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
                SetDialogReply(e.target.value);
              }}
              value={DialogReply}
              label="Reply"
            />
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
        <div>
          <Avatar
            crossOrigin="anonymous"
            src={`${process.env.REACT_APP_PUBLIC_IMG_URL}${reply?.user.photo}`}
            alt={reply?.user.name}
            size="sm"
          />
        </div>

        <div>
          <div className="flex flex-col">
            <Typography variant="small" color="white" className="font-normal">
              {reply?.user.name} {" - "}
              {moment(reply?.createdAt).format("D MMMM YYYY")}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="white" className="font-normal">
              {reply?.reply}
            </Typography>
          </div>

          <div>
            {reply?.user._id === user?._id ? (
              <div>
                <Tooltip content="Edit Reply">
                  <IconButton
                    onClick={() => {
                      handleOpen(
                        "Edit Reply",
                        reply?._id,
                        reply?.reply,
                        reply?.comment,
                        reply?.episode,
                        "edit"
                      );
                    }}
                    variant="text"
                    color="blue-gray"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Delete Reply">
                  <IconButton
                    onClick={() => {
                      handleOpen(
                        "Delete Reply",
                        reply?._id,
                        reply?.reply,
                        reply?.comment,
                        reply?.episode,
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
  );
}
