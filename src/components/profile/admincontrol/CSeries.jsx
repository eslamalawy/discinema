import React, { useEffect, useState, useRef } from "react";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  PaperAirplaneIcon,
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
import { CSeriesAPI } from "../../../API/CSeriesAPI";
import RaiseAlert2 from "../../Alerts/RaiseAlert2";
import { truncateString, validGenres } from "../../../utils";
import { useNavigate } from "react-router-dom";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Still",
    value: "still",
  },
];

const TABLE_HEAD = [
  "Series",
  "Seasons",
  "Ratings Average",
  "Genres",
  "KeyWords",
  "Lunch Year",
  "Status",
  "Edit",
  "Delete",
  "+S","+V"
];

export default function CSeries() {
  const navigateTo = useNavigate();
  const navigate = (val) => {
    navigateTo(val);
  };
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
  const KeywordRef = useRef(null);
  //tall image
  const TWidthRef = useRef(null);
  const THeightRef = useRef(null);
  const TSourceRef = useRef(null);
  // wide image
  const WWidthRef = useRef(null);
  const WHeightRef = useRef(null);
  const WSourceRef = useRef(null);

  //Dialog Info
  const [DialogTitle, SetDialogTitle] = useState(null);
  const [DialogId, SetDialogId] = useState(null);
  const [DialogName, SetDialogName] = useState(null);
  const [DialogDescription, SetDialogDescription] = useState(null);
  const [DialogisCompleted, SetDialogisCompleted] = useState(false);
  const [DialogLaunchYear, SetDialogLaunchYear] = useState(null);
  const [Dialogimages, SetDialogimages] = useState(null);
  const [Dialogkeywords, SetDialogkeywords] = useState([]);
  const [Dialoggenres, SetDialoggenres] = useState([]);
  const [DialogAction, SetDialogAction] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = (
    title,
    id,
    name,
    Description,
    isCompleted,
    LaunchYear,
    images,
    keywords,
    genres,
    action
  ) => {
    setOpen(!open);
    SetDialogTitle(title);
    SetDialogId(id);
    SetDialogName(name);
    SetDialogDescription(Description);
    SetDialogisCompleted(isCompleted);
    SetDialogLaunchYear(LaunchYear);
    SetDialogimages(images);
    SetDialogkeywords(keywords);
    SetDialoggenres(genres);
    SetDialogAction(action);
  };

  const handelDialogConfirm = async () => {
    if (DialogAction == "delete") {
      const res = await CSeriesAPI.DeleteSeries(DialogId);
      if (!res) {
        setMessage("Series Deleted Successfully!");
        setStatus("success");
        setshowAlert(true);
        fetchSeriesCount(filters);
        fetchSeries(currentPage, filters);
      } else {
        setStatus(res?.status);
        setMessage(res?.message);
        setshowAlert(true);
      }
    } else if (DialogAction == "edit") {
      const res = await CSeriesAPI.UpdateSeries(
        DialogId,
        DialogName,
        DialogDescription,
        DialogisCompleted,
        DialogLaunchYear,
        Dialogimages,
        Dialogkeywords,
        Dialoggenres
      );
      if (res?.status == "success") {
        setMessage("Series Updated Successfully!");
        setStatus(res?.status);
        setshowAlert(true);
        fetchSeriesCount(filters);
        fetchSeries(currentPage, filters);
      } else {
        setStatus(res?.status);
        setMessage(res?.message);
        setshowAlert(true);
      }
    } else if (DialogAction == "create") {
      const res = await CSeriesAPI.CreateSeries(
        DialogName,
        DialogDescription,
        DialogisCompleted,
        DialogLaunchYear,
        Dialogimages,
        Dialogkeywords,
        Dialoggenres
      );
      if (res?.status == "success") {
        setMessage("Series Created Successfully!");
        setStatus(res?.status);
        setshowAlert(true);
        fetchSeriesCount(filters);
        fetchSeries(currentPage, filters);
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

  const fetchSeries = async (actualpage, filter) => {
    const res = await CSeriesAPI.GetAllSeries(actualpage, filter);
    if (res?.status === "success") {
      //console.log("fetchSeries", res);
      setResults(res?.results);
      setTABLE_ROWS(res?.data?.data);
    }
  };

  const fetchSeriesCount = async (filter) => {
    const res_seriesCount = await CSeriesAPI.GetSeriesCount(filter);
    if (res_seriesCount?.status === "success") {
      setSeriesCount(res_seriesCount?.results);
      // Calculate the page count
      const count = Math.ceil(res_seriesCount?.results / 10);
      setPageCount(count);
    }
  };

  useEffect(() => {
    fetchSeriesCount(null);
    fetchSeries(currentPage, null);
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
    } else if (tab == "completed") {
      setFilters("&isCompleted=true");
      setCurrentPage(1);
    } else if (tab == "still") {
      setFilters("&isCompleted=false");
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchSeriesCount(filters);
    fetchSeries(currentPage, filters);
  }, [filters, currentPage]);

  const handelKeyWords = () => {
    const keywordText = KeywordRef.current.value;
    if (keywordText) {
      const newkeywords = [...Dialogkeywords];
      newkeywords.push(keywordText);
      SetDialogkeywords(newkeywords);
      KeywordRef.current.value = "";
    }
  };

  const handelTallPoster = () => {
    const width = TWidthRef.current.value;
    const height = THeightRef.current.value;
    const source = TSourceRef.current.value;
    const newTP = Dialogimages?.posterTall ? [...Dialogimages?.posterTall] : [];
    newTP.push({
      height,
      source,
      width,
    });

    const newImages = {
      posterTall: newTP,
      posterWide: Dialogimages?.posterWide ? Dialogimages?.posterWide : [],
    };
    SetDialogimages(newImages);
  };

  const handelWidePoster = () => {
    const width = WWidthRef.current.value;
    const height = WHeightRef.current.value;
    const source = WSourceRef.current.value;
    const newWP = Dialogimages?.posterWide ? [...Dialogimages?.posterWide] : [];
    newWP.push({
      height,
      source,
      width,
    });

    const newImages = {
      posterTall: Dialogimages?.posterTall ? Dialogimages?.posterTall : [],
      posterWide: newWP,
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
              <p className="mt-auto mb-auto">Completed: </p>
              <Checkbox
                checked={DialogisCompleted}
                onClick={() => {
                  SetDialogisCompleted(!DialogisCompleted);
                }}
                ripple={false}
                className="rounded-full w-5 h-5 hover:before:opacity-0 hover:scale-105 bg-blue-500/25 border-blue-500/50 transition-all"
              />
            </div>

            <div className="col-span-2">
              <Textarea
                onChange={(e) => {
                  SetDialogDescription(e.target.value);
                }}
                value={DialogDescription}
                label="Description"
              />
            </div>

            <Input
              onChange={(e) => {
                SetDialogLaunchYear(e.target.value);
              }}
              label="Launch Year"
              value={DialogLaunchYear}
            />
            <div className="flex gap-2">
              <div>
                <Menu
                  dismiss={{
                    itemPress: false,
                  }}
                >
                  <MenuHandler>
                    <Button>Genres</Button>
                  </MenuHandler>
                  <MenuList className="z-[9999]">
                    {validGenres.map((value) => (
                      <MenuItem className="p-0" key={value}>
                        <label
                          key={value}
                          htmlFor={`menu-v-${value}`}
                          className="flex cursor-pointer items-center gap-2 p-2"
                        >
                          <Checkbox
                            checked={Dialoggenres?.includes(value)}
                            onChange={(e) => {
                              if (Dialoggenres?.includes(value)) {
                                const newGenres = Dialoggenres?.filter((el) => {
                                  return el != value;
                                });
                                SetDialoggenres(newGenres);
                              } else {
                                let newGenres = [...Dialoggenres];
                                newGenres.push(value);
                                SetDialoggenres(newGenres);
                              }
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

              <div>
                <Menu
                  dismiss={{
                    itemPress: false,
                  }}
                >
                  <MenuHandler>
                    <Button>KeyWords</Button>
                  </MenuHandler>
                  <MenuList className="z-[9999]">
                    <Input
                      label="Keyword"
                      inputRef={KeywordRef}
                      icon={
                        <PaperAirplaneIcon
                          onClick={handelKeyWords}
                          className="h-5 w-5 hover:text-orange-600 hover:h-6 hover:w-6 cursor-pointer"
                        />
                      }
                      containerProps={{
                        className: "mb-4",
                      }}
                    />

                    {Dialogkeywords?.map((value) => (
                      <MenuItem className="p-0" key={value}>
                        <label
                          key={value}
                          htmlFor={`menu-v-${value}`}
                          className="flex cursor-pointer items-center gap-2 p-2"
                        >
                          <Checkbox
                            checked={Dialogkeywords?.includes(value)}
                            onChange={(e) => {
                              if (Dialogkeywords?.includes(value)) {
                                const newKeyWords = Dialogkeywords?.filter(
                                  (el) => {
                                    return el != value;
                                  }
                                );
                                SetDialogkeywords(newKeyWords);
                              }
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
                  {/* postertall */}
                  <Menu
                    className="w-full"
                    dismiss={{
                      itemPress: false,
                    }}
                  >
                    <MenuHandler className=" w-full">
                      <Button color="brown">Poster Tall</Button>
                    </MenuHandler>
                    <MenuList className="z-[10000] mt-19 w-1/2 bg-brown-900 text-white">
                      <Input
                        color="white"
                        className="text-white"
                        inputRef={TWidthRef}
                        label="width"
                        onClick={(event) => console.log(event.target.focus())}
                      />
                      <div className="mb-1"></div>
                      <Input
                        color="white"
                        className="text-white"
                        inputRef={THeightRef}
                        label="height"
                      />
                      <div className="mb-1"></div>
                      <Input
                        color="white"
                        inputRef={TSourceRef}
                        className="text-white"
                        label="source"
                      />

                      <div className="w-full mt-1 mb-3">
                        <Button onClick={handelTallPoster} className="w-full">
                          Submit Poster Tall
                        </Button>
                      </div>

                      {Dialogimages &&
                        Dialogimages.posterTall?.map(
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
                                    const newPosterTall =
                                      Dialogimages.posterTall?.filter((el) => {
                                        return el.source != source;
                                      });
                                    const newImages = {
                                      posterTall: newPosterTall,
                                      posterWide: Dialogimages.posterWide,
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
                                    className="h-15"
                                    src={source}
                                    variant="square"
                                    size="lg"
                                  />
                                  <div className="mt-auto mb-auto">
                                    <Typography variant="h5" color="white">
                                      {`width: ${width}`}
                                    </Typography>
                                  </div>

                                  <div className="mt-auto mb-auto">
                                    <Typography variant="h5" color="white">
                                      {`height: ${height}`}
                                    </Typography>
                                  </div>

                                  <div className="mt-auto mb-auto text-white">
                                    <Tooltip
                                      className="z-[10000]"
                                      content={source}
                                    >
                                      <Button
                                        onClick={(e) => {
                                          navigator.clipboard.writeText(source);
                                        }}
                                        color="cyan"
                                      >
                                        {" "}
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

                  {/* posterWide Menu */}
                  <div className="mt-2"></div>
                  <Menu
                    className="w-full"
                    dismiss={{
                      itemPress: false,
                    }}
                  >
                    <MenuHandler className=" w-full">
                      <Button color="purple">Poster Wide</Button>
                    </MenuHandler>
                    <MenuList className="z-[10000] mt-19 w-1/2 bg-purple-500 text-white">
                      <Input
                        color="white"
                        className="text-white"
                        inputRef={WWidthRef}
                        label="width"
                        onClick={(event) => console.log(event.target.focus())}
                      />
                      <div className="mb-1"></div>
                      <Input
                        color="white"
                        className="text-white"
                        inputRef={WHeightRef}
                        label="height"
                      />
                      <div className="mb-1"></div>
                      <Input
                        color="white"
                        inputRef={WSourceRef}
                        className="text-white"
                        label="source"
                      />

                      <div className="w-full mt-1 mb-3">
                        <Button onClick={handelWidePoster} className="w-full">
                          Submit Poster Wide
                        </Button>
                      </div>

                      {Dialogimages &&
                        Dialogimages.posterWide?.map(
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
                                        return el.source != source;
                                      });
                                    const newImages = {
                                      posterTall: Dialogimages.posterTall,
                                      posterWide: newPosterWide,
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
                                    src={source}
                                    variant="square"
                                    size="lg"
                                  />
                                  <div className="mt-auto mb-auto">
                                    <Typography variant="h5" color="white">
                                      {`width: ${width}`}
                                    </Typography>
                                  </div>

                                  <div className="mt-auto mb-auto">
                                    <Typography variant="h5" color="white">
                                      {`height: ${height}`}
                                    </Typography>
                                  </div>

                                  <div className="mt-auto mb-auto text-white">
                                    <Tooltip
                                      className="z-[10000]"
                                      content={source}
                                    >
                                      <Button
                                        onClick={(e) => {
                                          navigator.clipboard.writeText(source);
                                        }}
                                        color="cyan"
                                      >
                                        {" "}
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
              {`Series list [${seriesCount} Total Series]`}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              {`See information about ${results} series`}
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => {
                handleOpen(
                  "Create Series",
                  null,
                  null,
                  null,
                  false,
                  null,
                  [],
                  [],
                  [],
                  "create"
                );
              }}
              className="flex items-center gap-3"
              color="blue"
              size="sm"
            >
              <PlusIcon className="h-4 w-4 text-white" /> Add Series
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
                  SetSearchBy("genres");
                }}
                value={"genres"}
              >
                genres
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
              (
                {
                  _id,
                  name,
                  description,
                  isCompleted,
                  launchYear,
                  images,
                  keywords,
                  genres,
                  seasonsCount,
                  ratingsAverage,
                  ratingsQuantity,
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
                          src={images.posterWide[0]?.source}
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

                          <Tooltip content={description}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70"
                            >
                              {truncateString(description, 30)}
                            </Typography>
                          </Tooltip>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {seasonsCount}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {`${ratingsAverage} (${ratingsQuantity})`}
                      </Typography>
                    </td>
                    <td className={classes}>
                      {genres.map((genere) => (
                        <Typography variant="small" className="font-normal">
                          {genere}
                        </Typography>
                      ))}
                    </td>
                    <td className={classes}>
                      {keywords.map((keyword) => (
                        <Typography variant="small" className="font-normal">
                          {keyword}
                        </Typography>
                      ))}
                    </td>
                    <td className={classes}>
                      <Typography variant="small" className="font-normal">
                        {launchYear}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={isCompleted ? "Completed" : "Still"}
                          color={isCompleted ? "blue-gray" : "green"}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit Serie">
                        <IconButton
                          onClick={() => {
                            handleOpen(
                              "Edit Serie",
                              _id,
                              name,
                              description,
                              isCompleted,
                              launchYear,
                              images,
                              keywords,
                              genres,
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
                      <Tooltip content="Delete Serie">
                        <IconButton
                          onClick={() => {
                            handleOpen(
                              "Delete Serie",
                              _id,
                              name,
                              description,
                              isCompleted,
                              launchYear,
                              images,
                              keywords,
                              genres,
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
                      <Tooltip content="Add Season">
                        <IconButton
                          onClick={() => {
                            navigate(`/me/admin/season/${_id}`);
                          }}
                          variant="text"
                          color="green"
                        >
                          <PlusCircleIcon className=" h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Add Banner Video">
                        <IconButton
                          onClick={() => {
                            navigate(`/me/admin/video/s/${_id}`);
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
