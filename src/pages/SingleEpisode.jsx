import React, { useEffect, useState } from "react";
import PaddingTop from "../components/PaddingTop";
import { useParams } from "react-router-dom";
import { CSeriesAPI } from "../API/CSeriesAPI";
import { Spinner, Typography } from "@material-tailwind/react";

export default function SingleEpisode() {
  const { seriesSlug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [Series, setSeries] = useState({});

  useEffect(() => {
    async function fetchUser() {
      const res = await CSeriesAPI.GetSeriesCount(`&slug=${seriesSlug}`);
      if (res?.status === "success") {
        const sId = res.data.data[0]._id;
        const res2 = await CSeriesAPI.getSingleSeries(sId);
        if (res2?.status === "success") {
          setSeries(res2.data.data);
          setIsLoading(false);
        }
      }
    }
    fetchUser();
  }, []);

  if (isLoading) {
    // Show a loading spinner or placeholder while fetching the user data
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div>
          <Spinner className="h-16 w-16" color="purple" />
        </div>
        <Typography
          className="text-center mt-2 changa-one"
          variant="h3"
          color="blue"
        >
          DisCinema
        </Typography>

        <Typography className="text-center mt-2" variant="h5">
          Loading...
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <PaddingTop />
      <div> {Series._id}</div>
    </div>
  );
}
