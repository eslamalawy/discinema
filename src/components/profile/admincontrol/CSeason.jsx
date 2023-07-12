import React, { useEffect, useState, useRef } from "react";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
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
} from "@material-tailwind/react";
import RaiseAlert2 from "../../Alerts/RaiseAlert2";
import { CSeasonsAPI } from "../../../API/CSeasonsAPI";
import { useNavigate, useParams } from "react-router-dom";

const TABS = [
  {
    label: "All",
    value: "all",
  },
];

const TABLE_HEAD = [
  "Season",
  "Season Number",
  "Series",
  "Episodes Count",
  "Edit",
  "Delete",
  "",
];

export default function CSeason() {
  const navigateTo = useNavigate();
  const navigate = (val) => {
    navigateTo(val);
  };
  const { id } = useParams();
  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [seasonsCount, setSeasonsCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState(0);
  const [filters, setFilters] = useState(null);

  //Alert info
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  //Search info
  const [SearchBy, SetSearchBy] = useState("name");
  const SearchRef = useRef(null);

  //Dialog Info
  const [DialogTitle, SetDialogTitle] = useState(null);
  const [DialogId, SetDialogId] = useState(null);
  const [DialogName, SetDialogName] = useState(null);
  const [DialogNumber, SetDialogNumber] = useState(null);
  const [DialogSeries, SetDialogSeries] = useState(null);
  const [DialogAction, SetDialogAction] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = (title, id, name, number, series, action) => {
    setOpen(!open);
    SetDialogTitle(title);
    SetDialogId(id);
    SetDialogName(name);
    SetDialogNumber(number);
    SetDialogSeries(series);
    SetDialogAction(action);
  };

  const handelDialogConfirm = async () => {
    if (DialogAction == "delete") {
      const res = await CSeasonsAPI.DeleteSeason(DialogId);
      if (!res) {
        setMessage("Season Deleted Successfully!");
        setStatus("success");
        setshowAlert(true);
        fetchSeasonsCount(filters);
        fetchSeason(currentPage, filters);
      } else {
        setStatus(res?.status);
        setMessage(res?.message);
        setshowAlert(true);
      }
    } else if (DialogAction == "edit") {
      const res = await CSeasonsAPI.UpdateSeason(
        DialogId,
        DialogName,
        DialogNumber,
        DialogSeries
      );
      if (res?.status == "success") {
        setMessage("Season Updated Successfully!");
        setStatus(res?.status);
        setshowAlert(true);
        fetchSeasonsCount(filters);
        fetchSeason(currentPage, filters);
      } else {
        setStatus(res?.status);
        setMessage(res?.message);
        setshowAlert(true);
      }
    } else if (DialogAction == "create") {
      const res = await CSeasonsAPI.CreateSeason(
        DialogName,
        DialogNumber,
        DialogSeries
      );
      if (res?.status == "success") {
        setMessage("Season Created Successfully!");
        setStatus(res?.status);
        setshowAlert(true);
        fetchSeasonsCount(filters);
        fetchSeason(currentPage, filters);
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

  const fetchSeason = async (actualpage, filter) => {
    const res = await CSeasonsAPI.GetAllSseasons(actualpage, filter);
    if (res?.status === "success") {
      //console.log("fetchSeason", res);
      setResults(res?.results);
      setTABLE_ROWS(res?.data?.data);
    }
  };

  const fetchSeasonsCount = async (filter) => {
    const res_seasonCount = await CSeasonsAPI.GetSeasonsCount(filter);
    //console.log("fetchSeasonsCount", res_seasonCount);
    if (res_seasonCount?.status === "success") {
      setSeasonsCount(res_seasonCount?.results);
      // Calculate the page count
      const count = Math.ceil(res_seasonCount?.results / 10);
      setPageCount(count);
    }
  };

  useEffect(() => {
    fetchSeasonsCount(null);
    fetchSeason(currentPage, null);

    if (id) {
      handleOpen("Create Season", null, null, null, id, "create");
    }
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
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchSeasonsCount(filters);
    fetchSeason(currentPage, filters);
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
            <Input
              onChange={(e) => {
                SetDialogName(e.target.value);
              }}
              label="Name"
              value={DialogName}
            />

            <Input
              onChange={(e) => {
                SetDialogNumber(e.target.value);
              }}
              label="Season Number"
              value={DialogNumber}
            />

            <Input
              onChange={(e) => {
                SetDialogSeries(e.target.value);
              }}
              label="Series ID"
              value={DialogSeries}
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

      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              {`Season list [${seasonsCount} Total Seasons]`}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              {`See information about ${results} seasons`}
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => {
                handleOpen("Create Season", null, null, null, null, "create");
              }}
              className="flex items-center gap-3"
              color="blue"
              size="sm"
            >
              <PlusIcon className="h-4 w-4 text-white" /> Add Season
            </Button>
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
                  SetSearchBy("name");
                }}
                value={"name"}
              >
                name
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
              ({ _id, name, number, series, episodesCount, slug }, index) => {
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
                            {name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {slug}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {number}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {series}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {episodesCount}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit Season">
                        <IconButton
                          onClick={() => {
                            handleOpen(
                              "Edit Season",
                              _id,
                              name,
                              number,
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
                      <Tooltip content="Delete Season">
                        <IconButton
                          onClick={() => {
                            handleOpen(
                              "Delete Season",
                              _id,
                              name,
                              number,
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

                    <td className={classes}>
                      <Tooltip content="Add Episode">
                        <IconButton
                          onClick={() => {
                            navigate(`/me/admin/episode/${series}/${_id}`);
                          }}
                          variant="text"
                          color="green"
                        >
                          <PlusCircleIcon className=" h-5 w-5" />
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
