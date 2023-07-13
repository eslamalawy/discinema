import React, { useRef, useState, useEffect } from "react";
import PaddingTop from "../components/PaddingTop";
import SearchCardContent from "../components/search/SearchCardContent";
import { CSeriesAPI } from "../API/CSeriesAPI";
import {
  Button,
  Checkbox,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Tab,
  Tabs,
  TabsHeader,
} from "@material-tailwind/react";
import { validGenres } from "../utils";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "New",
    value: "new",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "Still",
    value: "still",
  },
  {
    label: "Popularity",
    value: "popularity",
  },
  {
    label: "Reviews",
    value: "reviews",
  },
  {
    label: "Seasons",
    value: "seasons",
  },
];

export default function Search() {
  const SearchRef = useRef(null);
  const [Results, setResults] = useState([]);
  const [filters, setFilters] = useState(null);
  const [generes, setGeneres] = useState(null);

  const fetchSeries = async (filter) => {
    const res = await CSeriesAPI.GetSeriesCount(filter);
    if (res?.status === "success") {
      //console.log(filter, "fetchSeries", res);
      setResults(res?.data.data);
    }
  };

  useEffect(() => {
    fetchSeries(null);
  }, []);

  const tabClick = (tab) => {
    // console.log("i'm on", tab);
    setGeneres(null);
    if (tab == "all") {
      setFilters(null);
    } else if (tab == "completed") {
      setFilters("&isCompleted=true");
    } else if (tab == "still") {
      setFilters("&isCompleted=false");
    } else if (tab == "popularity") {
      setFilters("&sort=-ratingsAverage");
    } else if (tab == "reviews") {
      setFilters("&sort=-ratingsQuantity");
    } else if (tab == "seasons") {
      setFilters("&sort=-seasonsCount");
    } else if (tab == "new") {
      setFilters("&sort=-launchYear");
    }
  };

  useEffect(() => {
    if (generes) {
      if (filters) {
        setFilters(`${filters}&genres=${generes}`);
      } else {
        setFilters(`&genres=${generes}`);
      }
    }
  }, [generes]);

  useEffect(() => {
    fetchSeries(filters);
  }, [filters]);

  return (
    <div className="">
      <PaddingTop />

      <div className="w-full p-2 flex flex-col md:flex-row gap-1 bg-pink-900 bg-opacity-70 ease-in-out duration-300">
        <div className="w-full">
          <Tabs
            value="all"
            className="w-full md:w-max md:overflow-hidden overflow-x-scroll"
          >
            <TabsHeader className="w-fit">
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
        </div>

        <div className="w-full">
          <Menu
            dismiss={{
              itemPress: false,
            }}
          >
            <MenuHandler className="w-full">
              <Button color="pink">Filter Genres</Button>
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
                      checked={generes === value}
                      onChange={(e) => {
                        setGeneres(value);
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

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-5 p-2">
        {Results.map((serie) => {
          return (
            <SearchCardContent key={serie?._id} serie={serie} color={"#aaa"} />
          );
        })}
      </div>
    </div>
  );
}
