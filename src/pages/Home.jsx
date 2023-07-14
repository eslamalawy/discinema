import React, { useEffect, useState } from "react";
import slides from "../components/SwiperVideo/mock.json";
import { SliderVideo } from "../components/SwiperVideo/slidervideo";
import SwiperAuto from "../components/SwiperContent/SwiperAuto";
import { getRandomHexColor } from "../utils";
import { CSeriesAPI } from "../API/CSeriesAPI";
import { Spinner, Typography } from "@material-tailwind/react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [completed, setCompleted] = useState(null);
  const [Notcompleted, setNotCompleted] = useState(null);
  const [popular, setpopular] = useState(null);
  const [reviews, setreviews] = useState(null);
  const [release, setrelease] = useState(null);
  const [action, setaction] = useState(null);
  const [BannerSeries, setBannerSeries] = useState([]);
  const [adventure, setadventure] = useState(null);
  const [comedy, setcomedy] = useState(null);
  const [drama, setdrama] = useState(null);
  const [fantasy, setfantasy] = useState(null);
  const [horror, sethorror] = useState(null);
  const [mystery, setmystery] = useState(null);
  const [romance, setromance] = useState(null);

  const fetchSeries = async (filter, stateOfResults) => {
    const res = await CSeriesAPI.GetSeriesCount(filter);
    if (res?.status === "success") {
      //  console.log(filter, "fetchSeries", res);
      stateOfResults(res?.data.data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const promises = [
        fetchSeries("&limit=5&sort=-ratingsAverage", setBannerSeries),
        fetchSeries("&limit=20&isCompleted=true", setCompleted),
        fetchSeries("&limit=20&isCompleted=false", setNotCompleted),
        fetchSeries("&limit=20&sort=-ratingsAverage", setpopular),
        fetchSeries("&limit=20&sort=-launchYear", setrelease),
        fetchSeries("&limit=20&sort=-ratingsQuantity", setreviews),
        fetchSeries("&limit=20&genres=action", setaction),
        fetchSeries("&limit=20&genres=adventure", setadventure),
        fetchSeries("&limit=20&genres=comedy", setcomedy),
        fetchSeries("&limit=20&genres=drama", setdrama),
        fetchSeries("&limit=20&genres=fantasy", setfantasy),
        fetchSeries("&limit=20&genres=horror", sethorror),
        fetchSeries("&limit=20&genres=mystery", setmystery),
        fetchSeries("&limit=20&genres=romance", setromance),
      ];

      try {
        await Promise.all(promises);
        setIsLoading(false);
      } catch (error) {
        // Handle error if any of the promises reject
        console.error("Error fetching series:", error);
      }
    };

    fetchData();
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
    <div className="erc-footer-i">
      <div className="h-screen">
        <SliderVideo BannerSeries={BannerSeries} />
      </div>

      <div className="ml-4 mr-4">
        {action?.length > 0 && (
          <SwiperAuto
            Series={action}
            Title={"Action Series"}
            color={getRandomHexColor()}
          />
        )}

        {adventure?.length > 0 && (
          <SwiperAuto
            Series={adventure}
            Title={"Adventure Series"}
            color={getRandomHexColor()}
          />
        )}

        {comedy?.length > 0 && (
          <SwiperAuto
            Series={comedy}
            Title={"Comedy Series"}
            color={getRandomHexColor()}
          />
        )}

        {drama?.length > 0 && (
          <SwiperAuto
            Series={drama}
            Title={"Drama Series"}
            color={getRandomHexColor()}
          />
        )}

        {horror?.length > 0 && (
          <SwiperAuto
            Series={horror}
            Title={"Horror Series"}
            color={getRandomHexColor()}
          />
        )}

        {mystery?.length > 0 && (
          <SwiperAuto
            Series={mystery}
            Title={"Mystery Series"}
            color={getRandomHexColor()}
          />
        )}

        {romance?.length > 0 && (
          <SwiperAuto
            Series={romance}
            Title={"Romance Series"}
            color={getRandomHexColor()}
          />
        )}

        {fantasy?.length > 0 && (
          <SwiperAuto
            Series={fantasy}
            Title={"Fantasy Series"}
            color={getRandomHexColor()}
          />
        )}

        {completed?.length > 0 && (
          <SwiperAuto
            Series={completed}
            Title={"Finished Series"}
            color={getRandomHexColor()}
          />
        )}
        {Notcompleted?.length > 0 && (
          <SwiperAuto
            Series={Notcompleted}
            Title={"Not Finished Series"}
            color={getRandomHexColor()}
          />
        )}
        {popular?.length > 0 && (
          <SwiperAuto
            Series={popular}
            Title={"Popular"}
            color={getRandomHexColor()}
          />
        )}
        {reviews?.length > 0 && (
          <SwiperAuto
            Series={reviews}
            Title={"High Reviewed"}
            color={getRandomHexColor()}
          />
        )}
        {release?.length > 0 && (
          <SwiperAuto
            Series={release}
            Title={"New Released"}
            color={getRandomHexColor()}
          />
        )}
      </div>
    </div>
  );
}
