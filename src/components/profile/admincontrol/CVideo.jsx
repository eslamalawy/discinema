import React, { useEffect, useState, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
  Checkbox,
  MenuItem,
  MenuHandler,
  MenuList,
  Menu,
  tooltip,
} from "@material-tailwind/react";
import RaiseAlert2 from "../../Alerts/RaiseAlert2";
import { useParams } from "react-router-dom";
import { CVideoAPI } from "../../../API/CVideoAPI";
import { truncateString, validMimeTypes, validSources } from "../../../utils";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Telegram",
    value: "telegram",
  },
  {
    label: "GoogleDrive",
    value: "googledrive",
  },
  {
    label: "OneDrive",
    value: "onedrive",
  },
];

const TABLE_HEAD = [
  "Video For",
  "Link",
  "Source",
  "MimeType",
  "Edit",
  "Delete",
];

export default function CVideo() {
  const { episodeId, seriesId } = useParams();
  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [videosCount, setVideosCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState(0);
  const [filters, setFilters] = useState(null);
  const [filtersInsider, setFiltersInsider] = useState(null);

  //Alert info
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  //Search info
  const [SearchBy, SetSearchBy] = useState("episode");
  const SearchRef = useRef(null);

  //info Videos
  const LinkRef = useRef(null);

  //Dialog Info
  const [DialogTitle, SetDialogTitle] = useState(null);
  const [DialogId, SetDialogId] = useState(null);
  const [DialogVids, SetDialogVids] = useState([]);
  const [DialogEpisode, SetDialogEpisode] = useState(null);
  const [DialogSeries, SetDialogSeries] = useState(null);
  const [DialogLogo, SetDialogLogo] = useState(null);
  const [DialogAction, SetDialogAction] = useState(null);
  //options
  const [DialogSource, SetDialogSource] = useState(null);
  const [DialogMimeType, SetDialogMimeType] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = (title, id, vids, episode, series, logo, action) => {
    setOpen(!open);
    SetDialogTitle(title);
    SetDialogId(id);
    SetDialogVids(vids);
    SetDialogEpisode(episode);
    SetDialogSeries(series);
    SetDialogLogo(logo);
    SetDialogAction(action);
  };

  const handelDialogConfirm = async () => {
    if (DialogAction == "delete") {
      const res = await CVideoAPI.DeleteVideo(DialogId);
      if (!res) {
        setMessage("Video Deleted Successfully!");
        setStatus("success");
        setshowAlert(true);
        fetchVideosCount(filters);
        fetchVideo(currentPage, filters);
      } else {
        setStatus(res?.status);
        setMessage(res?.message);
        setshowAlert(true);
      }
    } else if (DialogAction == "edit") {
      const res = await CVideoAPI.UpdateVideo(
        DialogId,
        DialogVids,
        DialogEpisode,
        DialogSeries,
        DialogLogo
      );
      if (res?.status == "success") {
        setMessage("Video Updated Successfully!");
        setStatus(res?.status);
        setshowAlert(true);
        fetchVideosCount(filters);
        fetchVideo(currentPage, filters);
      } else {
        setStatus(res?.status);
        setMessage(res?.message);
        setshowAlert(true);
      }
    } else if (DialogAction == "create") {
      const res = await CVideoAPI.CreateVideo(
        DialogVids,
        DialogEpisode,
        DialogSeries,
        DialogLogo
      );
      if (res?.status == "success") {
        setMessage("Video Created Successfully!");
        setStatus(res?.status);
        setshowAlert(true);
        fetchVideosCount(filters);
        fetchVideo(currentPage, filters);
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

  const fetchVideo = async (actualpage, filter) => {
    const res = await CVideoAPI.GetAllVideos(actualpage, filter);
    if (res?.status === "success") {
      if (filtersInsider) {
        console.log("in inseder", res);
        if (filtersInsider === "all") {
          setResults(res?.results);
          setTABLE_ROWS(res?.data?.data);
        } else {
          const newData = searchBySource(filtersInsider, res.data.data);
          setResults(newData.length);
          setTABLE_ROWS(newData);
        }
      } else {
        setResults(res?.results);
        setTABLE_ROWS(res?.data?.data);
      }
    }
  };

  const fetchVideosCount = async (filter) => {
    const res_videoCount = await CVideoAPI.GetVideosCount(filter);
    //console.log("fetchVideosCount", res_videoCount);
    if (res_videoCount?.status === "success") {
      if (filtersInsider) {
        if (filtersInsider === "all") {
          setVideosCount(res_videoCount?.results);
          // Calculate the page count
          const count = Math.ceil(res_videoCount?.results / 10);
          setPageCount(count);
        } else {
          const newData = searchBySource(
            filtersInsider,
            res_videoCount.data.data
          );

          setVideosCount(newData.length);
          const count = Math.ceil(newData.length / 10);
          setPageCount(count);
        }
      } else {
        setVideosCount(res_videoCount?.results);
        const count = Math.ceil(res_videoCount?.results / 10);
        setPageCount(count);
      }
    }
  };

  useEffect(() => {
    fetchVideosCount(null);
    fetchVideo(currentPage, null);

    if (episodeId) {
      handleOpen("Create Video", null, [], episodeId, null, null, "create");
    }
    if (seriesId) {
      handleOpen("Create Video", null, [], null, seriesId, null, "create");
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
      setFiltersInsider("all");
    } else if (tab == "telegram") {
      setFiltersInsider("telegram");
    } else if (tab == "googledrive") {
      setFiltersInsider("googledrive");
    } else if (tab == "onedrive") {
      setFiltersInsider("onedrive");
    }
    setFilters(null);
    setCurrentPage(1);
  };

  function searchBySource(source, results) {
    const returnedRes = [...results];
    const newArr = [];

    returnedRes.map((res) => {
      res.vids.map((vid) => {
        if (vid.source === source) {
          newArr.push(res);
        }
      });
    });

    return newArr;
  }

  useEffect(() => {
    fetchVideosCount(filters);
    fetchVideo(currentPage, filters);
  }, [filters, currentPage, filtersInsider]);

  const handelVideo = () => {
    const link = LinkRef.current.value;
    const mimeType = DialogMimeType;
    const source = DialogSource;
    if (link && mimeType && source) {
      const newVids = DialogVids ? [...DialogVids] : [];
      newVids.push({
        link,
        source,
        mimeType,
      });

      SetDialogVids(newVids);
    }
  };

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
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2  mb-2 ">
              <div className="justify-center flex">
                <Typography variant="h5" color="blue-gray">
                  Video For
                </Typography>

                {DialogEpisode && (
                  <Typography className="ml-2" variant="h5" color="red">
                    Eipsode
                  </Typography>
                )}

                {DialogSeries && (
                  <Typography className="ml-2" variant="h5" color="blue">
                    Series
                  </Typography>
                )}
              </div>
            </div>

            <Input
              onChange={(e) => {
                SetDialogSeries(e.target.value);
              }}
              label="Series ID"
              value={DialogSeries}
            />

            <Input
              onChange={(e) => {
                SetDialogEpisode(e.target.value);
              }}
              label="Episode ID"
              value={DialogEpisode}
            />

            {DialogSeries && (
              <div className="col-span-2  mb-2">
                <Input
                  onChange={(e) => {
                    SetDialogLogo(e.target.value);
                  }}
                  label="Logo Direct Link"
                  value={DialogLogo}
                />
              </div>
            )}

            <div className="col-span-2">
              <Menu
                dismiss={{
                  itemPress: false,
                }}
              >
                <MenuHandler className="w-full">
                  <Button>Videos</Button>
                </MenuHandler>
                <MenuList className="z-[9999] w-1/2">
                  <Input inputRef={LinkRef} label="Link" />
                  <div className="mb-1"></div>

                  <div className="flex gap-2">
                    <div className="w-full">
                      <Menu
                        dismiss={{
                          itemPress: false,
                        }}
                      >
                        <MenuHandler className="w-full bg-pink-500">
                          <Button>mime Type</Button>
                        </MenuHandler>
                        <MenuList className="z-[9999]">
                          <div className="max-h-40 overflow-y-scroll">
                            {validMimeTypes.map(({ type, value }) => (
                              <MenuItem className="p-0" key={value + type}>
                                <label
                                  key={value + type}
                                  htmlFor={`menu-v-${value}-${type}`}
                                  className="flex cursor-pointer items-center gap-2 p-2"
                                >
                                  <Checkbox
                                    checked={DialogMimeType === value}
                                    onChange={(e) => {
                                      SetDialogMimeType(value);
                                    }}
                                    key={value + type}
                                    value={value}
                                    ripple={false}
                                    id={`menu-v-${value}-${type}`}
                                    containerProps={{ className: "p-0" }}
                                    className="hover:before:content-none"
                                  />
                                  {`${type} - ${value}`}
                                </label>
                              </MenuItem>
                            ))}
                          </div>
                        </MenuList>
                      </Menu>
                    </div>

                    <div className="mb-1"></div>
                    {/* Sources */}
                    <div className="w-full">
                      <Menu
                        dismiss={{
                          itemPress: false,
                        }}
                      >
                        <MenuHandler className="w-full bg-brown-500">
                          <Button>source</Button>
                        </MenuHandler>
                        <MenuList className="z-[9999]">
                          {validSources.map((value) => (
                            <MenuItem className="p-0" key={value}>
                              <label
                                key={value}
                                htmlFor={`menu-v-${value}`}
                                className="flex cursor-pointer items-center gap-2 p-2"
                              >
                                <Checkbox
                                  checked={DialogSource === value}
                                  onChange={(e) => {
                                    SetDialogSource(value);
                                  }}
                                  key={value}
                                  value={value}
                                  ripple={false}
                                  id={`menu-v-${value}`}
                                  containerProps={{ className: "p-0" }}
                                  className="hover:before:content-none"
                                />
                                {value}
                              </label>
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                    </div>
                  </div>
                  <div className="w-full mt-1 mb-3">
                    <Button onClick={handelVideo} className="w-full">
                      Submit Video
                    </Button>
                  </div>

                  {DialogVids &&
                    DialogVids?.map(({ link, mimeType, source, _id }) => (
                      <MenuItem className="p-0" key={_id}>
                        <label
                          key={_id}
                          htmlFor={`menu-v-${_id}`}
                          className="flex cursor-pointer items-center gap-2 p-2"
                        >
                          <Checkbox
                            checked={true}
                            onChange={(e) => {
                              const newVids = DialogVids?.filter((el) => {
                                return el?.link != link;
                              });
                              SetDialogVids(newVids);
                            }}
                            key={_id}
                            value={link}
                            ripple={false}
                            id={`menu-v-${_id}`}
                            containerProps={{ className: "p-0" }}
                            className="hover:before:content-none"
                          />
                          <div className="flex gap-2">
                            <div className="mt-auto mb-auto">
                              <Typography variant="h5">
                                {`source: ${source}`}
                              </Typography>
                            </div>

                            <div className="mt-auto mb-auto">
                              <Typography variant="h5">
                                {`mimeType: ${mimeType}`}
                              </Typography>
                            </div>

                            <div className="mt-auto mb-auto text-white">
                              <Tooltip className="z-[10000]" content={link}>
                                <Button
                                  onClick={(e) => {
                                    navigator.clipboard.writeText(link);
                                  }}
                                  color="cyan"
                                >
                                  Copy Link
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        </label>
                      </MenuItem>
                    ))}
                </MenuList>
              </Menu>
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

      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              {`Videos list [${videosCount} Total Videos]`}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              {`See information about ${results} videos`}
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => {
                handleOpen(
                  "Create Video",
                  null,
                  [],
                  null,
                  null,
                  null,
                  "create"
                );
              }}
              className="flex items-center gap-3"
              color="blue"
              size="sm"
            >
              <PlusIcon className="h-4 w-4 text-white" /> Add Video
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
                  SetSearchBy("episode");
                }}
                value={"episode"}
              >
                episode
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
            {TABLE_ROWS.map(({ _id, vids, episode, series, logo }, index) => {
              const isLast = index === TABLE_ROWS.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={_id}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        {episode && (
                          <div>
                            <Typography
                              variant="small"
                              color="red"
                              className="font-bold"
                            >
                              Episode
                            </Typography>

                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {episode}
                            </Typography>
                          </div>
                        )}
                        {series && (
                          <div>
                            <Typography
                              variant="small"
                              color="blue"
                              className="font-bold"
                            >
                              Series
                            </Typography>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {series}
                            </Typography>
                            <Tooltip content={logo}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {truncateString(logo, 50)}
                              </Typography>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* vids array */}
                  <td className={classes}>
                    {vids?.map((video) => (
                      <Tooltip content={video?.link}>
                        <Typography variant="small" className="font-normal">
                          {truncateString(video?.link, 50)}
                        </Typography>
                      </Tooltip>
                    ))}
                  </td>

                  <td className={classes}>
                    {vids?.map((video) => (
                      <Typography variant="small" className="font-normal">
                        {video?.source}
                      </Typography>
                    ))}
                  </td>

                  <td className={classes}>
                    {vids?.map((video) => (
                      <Typography variant="small" className="font-normal">
                        {video?.mimeType}
                      </Typography>
                    ))}
                  </td>

                  <td className={classes}>
                    <Tooltip content="Edit Video">
                      <IconButton
                        onClick={() => {
                          handleOpen(
                            "Edit Video",
                            _id,
                            vids,
                            episode,
                            series,
                            logo,
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
                    <Tooltip content="Delete Video">
                      <IconButton
                        onClick={() => {
                          handleOpen(
                            "Delete Video",
                            _id,
                            vids,
                            episode,
                            series,
                            logo,
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
            })}
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
