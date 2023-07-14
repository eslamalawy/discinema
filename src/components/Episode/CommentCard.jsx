import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
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
import ReplyCard from "./ReplyCard";
import { MainContext } from "../../context/MainContext";
import RaiseAlert2 from "../Alerts/RaiseAlert2";
import { CEpisodeAPI } from "../../API/CEpisodeAPI";
import { CCommentsAPI } from "../../API/CCommentsAPI";

export default function CommentCard({ comment }) {
  const { user, setReply, setComment } = useContext(MainContext);
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [DialogTitle, SetDialogTitle] = useState(null);
  const [DialogId, SetDialogId] = useState(null);
  const [DialogComment, SetDialogComment] = useState(null);
  const [DialogCommentStr, SetDialogCommentStr] = useState(null);
  const [DialogEpisode, SetDialogEpisode] = useState(null);
  const [DialogReply, SetDialogReply] = useState(null);

  const [DialogAction, SetDialogAction] = useState(null);
  const handleOpen = (
    title,
    id,
    reply,
    comment,
    episode,
    action,
    commentStr
  ) => {
    setOpen(!open);
    SetDialogTitle(title);
    SetDialogId(id);
    SetDialogReply(reply);
    SetDialogComment(comment);
    SetDialogEpisode(episode);
    SetDialogAction(action);
    SetDialogCommentStr(commentStr);
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
      if (DialogAction === "create") {
        if (DialogEpisode && DialogReply && DialogComment) {
          const res = await CEpisodeAPI.createReplyOnCommentOfEpisode(
            DialogEpisode,
            DialogComment,
            DialogReply
          );
          if (res?.status === "success") {
            setMessage("Reply Created Successfully!");
            setStatus(res?.status);
            setReply(DialogReply);
            setshowAlert(true);
          } else {
            setStatus(res?.status);
            setMessage(res?.message);
            setshowAlert(true);
          }
        } else {
          setStatus("fail");
          setMessage("Fill all data");
          setshowAlert(true);
        }
      } else if (DialogAction === "edit") {
        const res = await CCommentsAPI.UpdateComment(
          DialogId,
          DialogCommentStr
        );
        if (res?.status == "success") {
          setMessage("Comment Updated Successfully!");
          setStatus(res?.status);
          setshowAlert(true);
          setComment(DialogCommentStr);
        } else {
          setStatus(res?.status);
          setMessage(res?.message);
          setshowAlert(true);
        }
      } else if (DialogAction == "delete") {
        const res = await CCommentsAPI.DeleteComment(DialogId);
        if (!res) {
          setMessage("Comment Deleted Successfully!");
          setStatus("success");
          setshowAlert(true);
          setComment(Date.now());
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
            {DialogAction == "create" && (
              <Textarea
                onChange={(e) => {
                  SetDialogReply(e.target.value);
                }}
                value={DialogReply}
                label="Reply"
              />
            )}

            {DialogCommentStr && (
              <Textarea
                onChange={(e) => {
                  SetDialogCommentStr(e.target.value);
                }}
                value={DialogCommentStr}
                label="Comment"
              />
            )}
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
            src={`${process.env.REACT_APP_PUBLIC_IMG_URL}${comment?.user.photo}`}
            alt={comment?.user.name}
            size="sm"
          />
        </div>

        <div>
          <div className="flex flex-col">
            <Typography variant="small" color="white" className="font-normal">
              {comment?.user.name} {" - "}
              {moment(comment?.createdAt).format("D MMMM YYYY")}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="white" className="font-normal">
              {comment?.comment}
            </Typography>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              onClick={() => {
                handleOpen(
                  "Create Reply",
                  comment?._id,
                  null,
                  comment?._id,
                  comment?.episode,
                  "create",
                  null
                );
              }}
              variant="outlined"
              className="h-3 text-[#f142a2] border-[#f142a2] flex items-center gap-1"
            >
              Reply
              <ChatBubbleOvalLeftEllipsisIcon
                strokeWidth={2}
                className="h-4 w-4"
              />
            </Button>
            <div>
              {comment?.user._id === user?._id ? (
                <div>
                  <Tooltip content="Edit Comment">
                    <IconButton
                      onClick={() => {
                        handleOpen(
                          "Edit Comment",
                          comment?._id,
                          null,
                          comment?._id,
                          comment?.episode,
                          "edit",
                          comment?.comment
                        );
                      }}
                      variant="text"
                      color="blue-gray"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Delete Comment">
                    <IconButton
                      onClick={() => {
                        handleOpen(
                          "Delete Comment",
                          comment?._id,
                          null,
                          comment?._id,
                          comment?.episode,
                          "delete",
                          comment?.comment
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

      <div>
        {comment.replies && (
          <div className="mt-1 ml-5 grid lg:grid-cols-1 gap-6 p-5">
            {comment.replies.map((reply) => {
              return <ReplyCard reply={reply} />;
            })}
          </div>
        )}
      </div>

      <hr />
    </div>
  );
}
