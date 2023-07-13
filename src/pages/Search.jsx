import React, { useRef, useState, useEffect } from "react";
import PaddingTop from "../components/PaddingTop";
import { Input } from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import $ from "jquery";
import SearchCardContent from "../components/search/SearchCardContent";
import { CSeriesAPI } from "../API/CSeriesAPI";

export default function Search() {
  const [SearchBegin, setSearchBegin] = useState(false);
  const SearchRef = useRef(null);
  const [timer, setTimer] = useState(null);
  const [SearchText, setSearchText] = useState(null);
  const [Results, setResults] = useState([]);

  useEffect(() => {
    $(SearchRef.current).removeClass("text-sm");
    $(SearchRef.current).addClass("text-lg");
    $(SearchRef.current).parent().children("label").css("font-size", "large");
  }, []);

  const handleInputChange = () => {
    if (timer) {
      clearTimeout(timer);
    }

    setTimer(
      setTimeout(() => {
        if (!SearchRef.current.value) {
          setSearchBegin(false);
        } else {
          setSearchBegin(true);
          setSearchText(SearchRef.current.value);
        }
      }, 1200)
    );
  };

  const SearchNow = async (searchKey) => {
    const res = await CSeriesAPI.Search(searchKey);
    if (res?.status === "success") {
      setResults(res?.data);
    }
  };

  useEffect(() => {
    const searchtxt = SearchRef.current.value;
    if (searchtxt) {
      SearchNow(searchtxt);
    }
  }, [SearchBegin, SearchText]);

  return (
    <div className="">
      <PaddingTop />

      <div
        className={`w-full flex justify-center items-center ease-in-out duration-300  ${
          SearchBegin ? "bg-gray-200" : ""
        }`}
      >
        <div className="p-3 w-1/2">
          <Input
            inputRef={SearchRef}
            onChange={handleInputChange}
            variant="standard"
            color="black"
            label="Search"
            icon={React.createElement(MagnifyingGlassIcon)}
          />
        </div>
      </div>

      {!SearchBegin && (
        <div className=" erc-footer-i h-[49.7vh] w-full" id="fadeElement"></div>
      )}
      {SearchBegin && (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-5 p-2">
          {Results.map((serie) => {
            return (
              <SearchCardContent
                key={serie?._id}
                serie={serie}
                color={"#aaa"}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
