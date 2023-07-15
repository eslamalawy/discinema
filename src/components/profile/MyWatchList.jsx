import { Typography } from "@material-tailwind/react";
import React, { useContext, useEffect, useState } from "react";
import { CWatchlistAPI } from "../../API/CWatchlistAPI";
import { MainContext } from "../../context/MainContext";
import { useNavigate } from "react-router-dom";
import WatchListCard from "../search/WatchListCard";
import { getRandomHexColor } from "../../utils";

export default function MyWatchList() {
  const { user, WatchList } = useContext(MainContext);
  const [Result, setResult] = useState([]);

  const navigateTo = useNavigate();

  async function fetchData() {
    if (user) {
      const res = await CWatchlistAPI.GetAllWatchlists(`&user=${user._id}`);
      if (res?.status === "success") {
        setResult(res.data.data);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [WatchList]);

  return (
    <div>
      <div className="w-all felx items-center text-center bg-pink-900 justify-center">
        <div>
          <Typography className="text-center" variant="h3" color="white">
            My Watch List
          </Typography>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-5 p-2">
        {Result.map(({ _id, series }) => {
          return (
            <WatchListCard
              key={_id}
              serie={series}
              watchlist_id={_id}
              color={getRandomHexColor()}
            />
          );
        })}
      </div>
    </div>
  );
}
