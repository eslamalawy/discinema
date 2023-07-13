import React, { useEffect, useState, useRef } from "react";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Textarea,
  Menu,
  MenuItem,
  MenuList,
  MenuHandler,
  Typography,
  Button,
  Checkbox,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Select,
  Option,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import RaiseAlert2 from "../../Alerts/RaiseAlert2";
import { truncateString, validMediaType } from "../../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { CEpisodeAPI } from "../../../API/CEpisodeAPI";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Premium",
    value: "premium",
  },
  {
    label: "Free",
    value: "free",
  },
  {
    label: "Episode",
    value: "episode",
  },
  {
    label: "Movie",
    value: "movie",
  },
  {
    label: "Filler",
    value: "filler",
  },
];


const TABLE_HEAD = [
  "Episode",
  "MediaType",
  "CommentsCount",
  "Series",
  "Season",
  "Premium",
  "Filler",
  "Number",
  "SequenceNumber",
  "Minutes",
  "Edit",
  "Delete",
  "",
];

export default function CEpisode() {
  const navigateTo = useNavigate();
  const navigate = (val) => {
    navigateTo(val);
  };
  const { seriesId, seasonId } = useParams();
  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [seriesCount, setSeriesCount] = useState(0);
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
  
  //image
  const WidthRef = useRef(null);
  const HeightRef = useRef(null);
  const SourceRef = useRef(null);

  //Dialog Info
  const [DialogTitle, SetDialogTitle] = useState(null);
  const [DialogId, SetDialogId] = useState(null);
  const [DialogName, SetDialogName] = useState(null);
  const [DialogSummary, SetDialogSummary] = useState(null);
  const [DialogNumber, SetDialogNumber] = useState(0);
  const [DialogMinutes, SetDialogMinutes] = useState(0);
  const [DialogSequenceNumber, SetDialogSequenceNumber] = useState(0);
  const [DialogPremium, SetDialogPremium] = useState(false);
  const [DialogFiller, SetDialogFiller] = useState(false);
  const [DialogSeries, SetDialogSeries] = useState(null);
  const [DialogSeason, SetDialogSeason] = useState(null);
  const [DialogMediaType, SetDialogMediaTyp] = useState(null);
  const [Dialogimages, SetDialogimages] = useState(null);
  const [DialogAction, SetDialogAction] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = (
    title,
    id,
    name,
    summary,
    number,
    sequenceNumber,
    premium,
    filler,
    series,
    season,
    mediaType,
    images,
    minutes,
    action
  ) => {
    setOpen(!open);
    SetDialogTitle(title);
    SetDialogId(id);
    SetDialogName(name);
    SetDialogSummary(summary);
    SetDialogNumber(number);
    SetDialogSequenceNumber(sequenceNumber);
    SetDialogMinutes(minutes);
    SetDialogPremium(premium);
    SetDialogFiller(filler);
    SetDialogSeries(series);
    SetDialogSeason(season);
    SetDialogMediaTyp(mediaType);
    SetDialogimages(images);
    SetDialogAction(action);
  };

  const handelDialogConfirm = async () => {
    if (DialogAction == "delete") {
      const res = await CEpisodeAPI.DeleteEpisode(DialogId);
      if (!res) {
        setMessage("Episode Deleted Successfully!");
        setStatus("success");
        setshowAlert(true);
        fetchEpisodesCount(filters);
        fetchEpisodes(currentPage, filters);
      } else {
        setStatus(res?.status);
        setMessage(res?.message);
        setshowAlert(true);
      }
    } else if (DialogAction == "edit") {
      const res = await CEpisodeAPI.UpdateEpisode(
        DialogId,
        DialogName,
        DialogSummary,
        DialogNumber,
        DialogSequenceNumber,
        DialogPremium,
        DialogFiller,
        DialogSeries,
        DialogSeason,
        DialogMediaType,
        Dialogimages,
        DialogMinutes
      );
      if (res?.status == "success") {
        setMessage("Episode Updated Successfully!");
        setStatus(res?.status);
        setshowAlert(true);
        fetchEpisodesCount(filters);
        fetchEpisodes(currentPage, filters);
      } else {
        setStatus(res?.status);
        setMessage(res?.message);
        setshowAlert(true);
      }
    } else if (DialogAction == "create") {
      const res = await CEpisodeAPI.CreateEpisode(
        DialogName,
        DialogSummary,
        DialogNumber,
        DialogSequenceNumber,
        DialogPremium,
        DialogFiller,
        DialogSeries,
        DialogSeason,
        DialogMediaType,
        Dialogimages,
        DialogMinutes
      );
      if (res?.status == "success") {
        setMessage("Episode Created Successfully!");
        setStatus(res?.status);
        setshowAlert(true);
        fetchEpisodesCount(filters);
        fetchEpisodes(currentPage, filters);
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

  const fetchEpisodes = async (actualpage, filter) => {
    const res = await CEpisodeAPI.GetAllEpisodes(actualpage, filter);
    if (res?.status === "success") {
      //console.log("fetchEpisodes", res);
      setResults(res?.results);
      setTABLE_ROWS(res?.data?.data);
    }
  };

  const fetchEpisodesCount = async (filter) => {
    const res_episodesCount = await CEpisodeAPI.GetEpisodeCount(filter);
    if (res_episodesCount?.status === "success") {
      setSeriesCount(res_episodesCount?.results);
      // Calculate the page count
      const count = Math.ceil(res_episodesCount?.results / 10);
      setPageCount(count);
    }
  };

  useEffect(() => {
    fetchEpisodesCount(null);
    fetchEpisodes(currentPage, null);
    console.log(seriesId);
    if (seasonId && seriesId) {
      handleOpen(
        "Create Episode",
        null,
        null,
        null,
        null,
        null,
        false,
        false,
        seriesId,
        seasonId,
        null,
        null,
        null,
        "create"
      );
    }
  }, []);

  const handelSearch = () => {
    const searchText = SearchRef.current.children[1].value;
    const filter_search = `${filters}&${SearchBy}=${searchText}`;
    // console.log(filter_search)
    setFilters(filter_search);
  };

  const tabClick = (tab) => {
    // console.log("i'm on", tab);
    if (tab == "all") {
      setFilters(null);
      setCurrentPage(1);
    } else if (tab == "premium") {
      setFilters("&premium=true");
      setCurrentPage(1);
    } else if (tab == "free") {
      setFilters("&premium=false");
      setCurrentPage(1);
    } else if (tab == "episode") {
      setFilters("&mediaType=episode");
      setCurrentPage(1);
    } else if (tab == "movie") {
      setFilters("&mediaType=movie");
      setCurrentPage(1);
    } else if (tab == "filler") {
      setFilters("&filler=true");
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchEpisodesCount(filters);
    fetchEpisodes(currentPage, filters);
  }, [filters, currentPage]);

  const handelthumbnail = () => {
    const width = WidthRef.current.value;
    const height = HeightRef.current.value;
    const source = SourceRef.current.value;
    const newThumps = Dialogimages?.thumbnail
      ? [...Dialogimages?.thumbnail]
      : [];
    newThumps.push({
      height,
      source,
      width,
    });
    const newImages = {
      thumbnail: newThumps,
    };
    SetDialogimages(newImages);
  };

  return (
    <Card className="h-full w-full">
      <Dialog
        className="h-full"
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
            <Input
              onChange={(e) => {
                SetDialogName(e.target.value);
              }}
              label="Name"
              value={DialogName}
            />

            <div className="flex">
              <p className="mt-auto mb-auto">Premium: </p>
              <Checkbox
                checked={DialogPremium}
                onClick={() => {
                  SetDialogPremium(!DialogPremium);
                }}
                ripple={false}
                className="rounded-full w-5 h-5 hover:before:opacity-0 hover:scale-105 bg-blue-500/25 border-blue-500/50 transition-all"
              />

              <p className="mt-auto mb-auto">Filler: </p>
              <Checkbox
                checked={DialogFiller}
                onClick={() => {
                  SetDialogFiller(!DialogFiller);
                }}
                ripple={false}
                className="rounded-full w-5 h-5 hover:before:opacity-0 hover:scale-105 bg-blue-500/25 border-blue-500/50 transition-all"
              />
            </div>

            <Input
              onChange={(e) => {
                SetDialogMinutes(e.target.value);
              }}
              label="Minutes"
              value={DialogMinutes}
            />

            <div className="w-full">
              <Menu
                dismiss={{
                  itemPress: false,
                }}
              >
                <MenuHandler className="w-full">
                  <Button>Media Type</Button>
                </MenuHandler>
                <MenuList className="z-[9999]">
                  {validMediaType.map((value) => (
                    <MenuItem className="p-0" key={value}>
                      <label
                        key={value}
                        htmlFor={`menu-v-${value}`}
                        className="flex cursor-pointer items-center gap-2 p-2"
                      >
                        <Checkbox
                          checked={DialogMediaType === value}
                          onChange={(e) => {
                            SetDialogMediaTyp(value);
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

            <Input
              onChange={(e) => {
                SetDialogNumber(e.target.value);
              }}
              label="Number"
              value={DialogNumber}
            />

            <Input
              onChange={(e) => {
                SetDialogSequenceNumber(e.target.value);
              }}
              label="Sequence Number"
              value={DialogSequenceNumber}
            />

            <div className="col-span-2">
              <Textarea
                onChange={(e) => {
                  SetDialogSummary(e.target.value);
                }}
                value={DialogSummary}
                label="Summary"
              />
            </div>
            <Input
              onChange={(e) => {
                SetDialogSeries(e.target.value);
              }}
              label="Series"
              value={DialogSeries}
            />

            <Input
              onChange={(e) => {
                SetDialogSeason(e.target.value);
              }}
              label="Season"
              value={DialogSeason}
            />

            <div className="col-span-2">
              {/* images menu */}
              <Menu
                dismiss={{
                  itemPress: false,
                }}
              >
                <MenuHandler className="w-full">
                  <Button>Images</Button>
                </MenuHandler>
                <MenuList className="z-[9999] w-1/2">
                  <Input
                    inputRef={WidthRef}
                    label="width"
                    onClick={(event) => console.log(event.target.focus())}
                  />
                  <div className="mb-1"></div>
                  <Input inputRef={HeightRef} label="height" />
                  <div className="mb-1"></div>
                  <Input inputRef={SourceRef} label="source" />

                  <div className="w-full mt-1 mb-3">
                    <Button onClick={handelthumbnail} className="w-full">
                      Submit Thumbnail
                    </Button>
                  </div>

                  {Dialogimages &&
                    Dialogimages.thumbnail?.map(
                      ({ height, width, source, _id }) => (
                        <MenuItem className="p-0" key={_id}>
                          <label
                            key={_id}
                            htmlFor={`menu-v-${_id}`}
                            className="flex cursor-pointer items-center gap-2 p-2"
                          >
                            <Checkbox
                              checked={true}
                              onChange={(e) => {
                                const newPosterWide =
                                  Dialogimages.posterWide?.filter((el) => {
                                    return el?.source != source;
                                  });
                                const newImages = {
                                  thumbnail: newPosterWide,
                                };
                                SetDialogimages(newImages);
                              }}
                              key={_id}
                              value={source}
                              ripple={false}
                              id={`menu-v-${_id}`}
                              containerProps={{ className: "p-0" }}
                              className="hover:before:content-none"
                            />
                            <div className="flex gap-2">
                              <Avatar
                                className="w-15"
                                src={source ? source : ""}
                                variant="square"
                                size="lg"
                              />
                              <div className="mt-auto mb-auto">
                                <Typography variant="h5">
                                  {`width: ${width}`}
                                </Typography>
                              </div>

                              <div className="mt-auto mb-auto">
                                <Typography variant="h5">
                                  {`height: ${height}`}
                                </Typography>
                              </div>

                              <div className="mt-auto mb-auto text-white">
                                <Tooltip className="z-[10000]" content={source}>
                                  <Button
                                    onClick={(e) => {
                                      navigator.clipboard.writeText(source);
                                    }}
                                    color="cyan"
                                  >
                                    Copy source Link
                                  </Button>
                                </Tooltip>
                              </div>
                            </div>
                          </label>
                        </MenuItem>
                      )
                    )}
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
              {`Episodes list [${seriesCount} Total Episodes]`}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              {`See information about ${results} episode`}
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => {
                handleOpen(
                  "Create Episode",
                  null,
                  null,
                  null,
                  null,
                  null,
                  false,
                  false,
                  null,
                  null,
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
              <PlusIcon className="h-4 w-4 text-white" /> Add Episode
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
              <div className="flex ">
                <Option
                  className="z-[10000]"
                  onClick={() => {
                    SetSearchBy("series");
                  }}
                  value={"series"}
                >
                  series
                </Option>
                <Option
                  className="z-[10000]"
                  onClick={() => {
                    SetSearchBy("season");
                  }}
                  value={"season"}
                >
                  season
                </Option>
              </div>

              <Option
                className="z-[10000]"
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
              (
                {
                  _id,
                  name,
                  summary,
                  mediaType,
                  commentsCount,
                  season,
                  series,
                  filler,
                  premium,
                  sequenceNumber,
                  number,
                  images,
                  minutes,
                  slug,
                },
                index
              ) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={_id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          className="w-15"
                          src={images.thumbnail[0]?.source}
                          alt={name}
                          variant="square"
                          size="lg"
                        />
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

                          <Tooltip content={summary}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70"
                            >
                              {truncateString(summary, 30)}
                            </Typography>
                          </Tooltip>
                        </div>
                      </div>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {mediaType}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {commentsCount}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {series}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {season}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={premium ? "Premium" : "Free"}
                          color={premium ? "yellow" : "green"}
                        />
                      </div>
                    </td>

                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={filler ? "Filler" : "Content"}
                          color={filler ? "blue-gray" : "green"}
                        />
                      </div>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {number}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {sequenceNumber}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {minutes}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Tooltip content="Edit Episode">
                        <IconButton
                          onClick={() => {
                            handleOpen(
                              "Edit Episode",
                              _id,
                              name,
                              summary,
                              number,
                              sequenceNumber,
                              premium,
                              filler,
                              series,
                              season,
                              mediaType,
                              images,
                              minutes,
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
                      <Tooltip content="Delete Episode">
                        <IconButton
                          onClick={() => {
                            handleOpen(
                              "Delete Episode",
                              _id,
                              name,
                              summary,
                              number,
                              sequenceNumber,
                              premium,
                              filler,
                              series,
                              season,
                              mediaType,
                              images,
                              minutes,
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
                      <Tooltip content="Add Video">
                        <IconButton
                          onClick={() => {
                            navigate(`/me/admin/video/${_id}`);
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
