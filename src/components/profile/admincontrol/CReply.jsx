import React, { useEffect, useState, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import moment from "moment/moment";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Select,
  Option,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Avatar,
  Textarea,
} from "@material-tailwind/react";
import RaiseAlert2 from "../../Alerts/RaiseAlert2";
import { CReplyAPI } from "../../../API/CReplyAPI";

const TABS = [
  {
    label: "All",
    value: "all",
  },
];

const TABLE_HEAD = ["Reply", "User", "Comment", "Episode", "Edit", "Delete"];

export default function CReply() {
  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [seasonsCount, setCommentsCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState(0);
  const [filters, setFilters] = useState(null);

  //Alert info
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  //Search info
  const [SearchBy, SetSearchBy] = useState("user");
  const SearchRef = useRef(null);

  //Dialog Info
  const [DialogTitle, SetDialogTitle] = useState(null);
  const [DialogId, SetDialogId] = useState(null);
  const [DialogComment, SetDialogComment] = useState(null);
  const [DialogEpisode, SetDialogEpisode] = useState(null);
  const [DialogReply, SetDialogReply] = useState(null);
  const [DialogUser, SetDialogUser] = useState(null);
  const [DialogAction, SetDialogAction] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = (title, id, reply, comment, user, episode, action) => {
    setOpen(!open);
    SetDialogTitle(title);
    SetDialogId(id);
    SetDialogReply(reply);
    SetDialogComment(comment);
    SetDialogUser(user);
    SetDialogEpisode(episode);
    SetDialogAction(action);
  };

  const handelDialogConfirm = async () => {
    if (DialogAction == "delete") {
      const res = await CReplyAPI.DeleteReply(DialogId);
      if (!res) {
        setMessage("Reply Deleted Successfully!");
        setStatus("success");
        setshowAlert(true);
        fetchRepliesCount(filters);
        fetchReply(currentPage, filters);
      } else {
        setStatus(res?.status);
        setMessage(res?.message);
        setshowAlert(true);
      }
    } else if (DialogAction == "edit") {
      const res = await CReplyAPI.UpdateReply(DialogId, DialogReply);
      if (res?.status == "success") {
        setMessage("Reply Updated Successfully!");
        setStatus(res?.status);
        setshowAlert(true);
        fetchRepliesCount(filters);
        fetchReply(currentPage, filters);
      } else {
        setStatus(res?.status);
        setMessage(res?.message);
        setshowAlert(true);
      }
    }
    setOpen(!open);
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

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchReply = async (actualpage, filter) => {
    const res = await CReplyAPI.GetAllReplies(actualpage, filter);
    if (res?.status === "success") {
      //console.log("fetchReply", res);
      setResults(res?.results);
      setTABLE_ROWS(res?.data?.data);
    }
  };

  const fetchRepliesCount = async (filter) => {
    const res_ReplyCount = await CReplyAPI.GetRepliesCount(filter);
    //console.log("fetchRepliesCount", res_ReplyCount);
    if (res_ReplyCount?.status === "success") {
      setCommentsCount(res_ReplyCount?.results);
      // Calculate the page count
      const count = Math.ceil(res_ReplyCount?.results / 10);
      setPageCount(count);
    }
  };

  useEffect(() => {
    fetchRepliesCount(null);
    fetchReply(currentPage, null);
  }, []);

  const handelSearch = () => {
    const searchText = SearchRef.current.children[1].value;
    const filter_search = `${filters}&${SearchBy}=${searchText}`;
    // console.log(filter_search)
    setFilters(filter_search);
  };

  const tabClick = (tab) => {
    if (tab == "all") {
      setFilters(null);
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchRepliesCount(filters);
    fetchReply(currentPage, filters);
  }, [filters, currentPage]);

  return (
    <Card className="h-full w-full">
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
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none opacity-70"
            >
              Episode ID
            </Typography>
            <Input disabled label="Episode ID" value={DialogEpisode} />

            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none opacity-70"
            >
              Comment ID
            </Typography>
            <Input disabled label="Comment ID" value={DialogComment} />
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none opacity-70"
            >
              User ID
            </Typography>
            <Input disabled label="User ID" value={DialogUser?._id} />
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

      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              {`Replies list [${seasonsCount} Total Replies]`}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              {`See information about ${results} replies`}
            </Typography>
          </div>
          {showAlert && <RaiseAlert2 state={status} message={message} />}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value="all" className="w-full md:w-max">
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab
                  onClick={() => {
                    tabClick(value);
                  }}
                  key={value}
                  value={value}
                >
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className="w-full md:w-1/2  flex">
            <Select value={SearchBy} label="Search By">
              <div className="max-h-11 overflow-y-scroll">
                <Option
                  className="mb-2"
                  onClick={() => {
                    SetSearchBy("episode");
                  }}
                  value={"episode"}
                >
                  episode
                </Option>
                <Option
                  className="mb-2"
                  onClick={() => {
                    SetSearchBy("comment");
                  }}
                  value={"comment"}
                >
                  comment
                </Option>
                <Option
                  className="mb-2"
                  onClick={() => {
                    SetSearchBy("user");
                  }}
                  value={"user"}
                >
                  user
                </Option>
              </div>
            </Select>

            <Input
              ref={SearchRef}
              label="Search"
              icon={
                <MagnifyingGlassIcon
                  onClick={handelSearch}
                  className="h-5 w-5 hover:text-orange-600 hover:h-6 hover:w-6 cursor-pointer"
                />
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(
              ({ _id, comment, reply, createdAt, episode, user }, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={_id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {reply}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {moment(createdAt).format(
                              "dddd D/MM/YYYY hh:mm:ss"
                            )}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          crossOrigin="anonymous"
                          src={`${process.env.REACT_APP_PUBLIC_IMG_URL}${user?.photo}`}
                          alt={user?.name}
                          size="sm"
                        />
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {user?.name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            {user?._id}
                          </Typography>
                        </div>
                      </div>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {comment}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {episode}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit Reply">
                        <IconButton
                          onClick={() => {
                            handleOpen(
                              "Edit Reply",
                              _id,
                              reply,
                              comment,
                              user,
                              episode,
                              "edit"
                            );
                          }}
                          variant="text"
                          color="blue-gray"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Delete Reply">
                        <IconButton
                          onClick={() => {
                            handleOpen(
                              "Delete Reply",
                              _id,
                              reply,
                              comment,
                              user,
                              episode,
                              "delete"
                            );
                          }}
                          variant="text"
                          color="red"
                        >
                          <TrashIcon className=" h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          {`Page ${currentPage} of ${pageCount}`}
        </Typography>
        <div className="flex gap-2">
          <Button
            onClick={handlePrevious}
            variant="outlined"
            color="blue-gray"
            size="sm"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            variant="outlined"
            color="blue-gray"
            size="sm"
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
