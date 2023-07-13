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
import { CReviewsAPI } from "../../../API/CReviewsAPI";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "1S",
    value: "1s",
  },
  {
    label: "2S",
    value: "2s",
  },
  {
    label: "3S",
    value: "3s",
  },
  {
    label: "4S",
    value: "4s",
  },
  {
    label: "5S",
    value: "5s",
  },
];

const TABLE_HEAD = ["Review", "Rating", "User", "Series", "Edit", "Delete"];

export default function CReviews() {
  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [seasonsCount, setReviewsCount] = useState(0);
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
  const [DialogReview, SetDialogReview] = useState(null);
  const [DialogRating, SetDialogRating] = useState(null);
  const [DialogSeries, SetDialogSeries] = useState(null);
  const [DialogUser, SetDialogUser] = useState(null);
  const [DialogAction, SetDialogAction] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = (title, id, review, rating, user, series, action) => {
    setOpen(!open);
    SetDialogTitle(title);
    SetDialogId(id);
    SetDialogReview(review);
    SetDialogRating(rating);
    SetDialogUser(user);
    SetDialogSeries(series);
    SetDialogAction(action);
  };

  const handelDialogConfirm = async () => {
    if (DialogAction == "delete") {
      const res = await CReviewsAPI.DeleteReview(DialogId);
      if (!res) {
        setMessage("Review Deleted Successfully!");
        setStatus("success");
        setshowAlert(true);
        fetchReviewsCount(filters);
        fetchReview(currentPage, filters);
      } else {
        setStatus(res?.status);
        setMessage(res?.message);
        setshowAlert(true);
      }
    } else if (DialogAction == "edit") {
      const res = await CReviewsAPI.UpdateReview(
        DialogId,
        DialogReview,
        DialogRating
      );
      if (res?.status == "success") {
        setMessage("Review Updated Successfully!");
        setStatus(res?.status);
        setshowAlert(true);
        fetchReviewsCount(filters);
        fetchReview(currentPage, filters);
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

  const fetchReview = async (actualpage, filter) => {
    const res = await CReviewsAPI.GetAllReviews(actualpage, filter);
    if (res?.status === "success") {
      //console.log("fetchReview", res);
      setResults(res?.results);
      setTABLE_ROWS(res?.data?.data);
    }
  };

  const fetchReviewsCount = async (filter) => {
    const res_reviewCount = await CReviewsAPI.GetReviewsCount(filter);
    //console.log("fetchReviewsCount", res_reviewCount);
    if (res_reviewCount?.status === "success") {
      setReviewsCount(res_reviewCount?.results);
      // Calculate the page count
      const count = Math.ceil(res_reviewCount?.results / 10);
      setPageCount(count);
    }
  };

  useEffect(() => {
    fetchReviewsCount(null);
    fetchReview(currentPage, null);
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
    } else if (tab == "1s") {
      setFilters("&rating=1");
    } else if (tab == "2s") {
      setFilters("&rating=2");
    } else if (tab == "3s") {
      setFilters("&rating=3");
    } else if (tab == "4s") {
      setFilters("&rating=4");
    } else if (tab == "5s") {
      setFilters("&rating=5");
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchReviewsCount(filters);
    fetchReview(currentPage, filters);
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
                SetDialogReview(e.target.value);
              }}
              value={DialogReview}
              label="Review"
            />

            <Input
              onChange={(e) => {
                SetDialogRating(e.target.value);
              }}
              label="Rating"
              value={DialogRating}
            />

            <Input disabled label="Series ID" value={DialogSeries} />
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
              {`Reviews list [${seasonsCount} Total Reviews]`}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              {`See information about ${results} reviews`}
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
              <Option
                onClick={() => {
                  SetSearchBy("series");
                }}
                value={"series"}
              >
                series
              </Option>
              <Option
                onClick={() => {
                  SetSearchBy("user");
                }}
                value={"user"}
              >
                user
              </Option>
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
              ({ _id, review, rating, createdAt, series, user }, index) => {
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
                            {review}
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
                      <Typography variant="small" className="font-normal">
                        {rating}
                      </Typography>
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
                        {series}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit Review">
                        <IconButton
                          onClick={() => {
                            handleOpen(
                              "Edit Review",
                              _id,
                              review,
                              rating,
                              user,
                              series,
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
                      <Tooltip content="Delete Review">
                        <IconButton
                          onClick={() => {
                            handleOpen(
                              "Delete Review",
                              _id,
                              review,
                              rating,
                              user,
                              series,
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
