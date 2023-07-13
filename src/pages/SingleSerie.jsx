import React, { useContext, useEffect, useRef, useState } from "react";
import PaddingTop from "../components/PaddingTop";
import { useParams } from "react-router-dom";
import { CSeriesAPI } from "../API/CSeriesAPI";
import {
  Button,
  Checkbox,
  Chip,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Rating,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { getRandomColor } from "../utils";
import EpisodeCard from "../components/Episode/EpisodeCard";
import { CSeasonsAPI } from "../API/CSeasonsAPI";
import ReviewCard from "../components/Episode/ReviewCard";
import RaiseAlert2 from "../components/Alerts/RaiseAlert2";
import { MainContext } from "../context/MainContext";

export default function SingleSerie() {
  const { seriesSlug } = useParams();
  const { user } = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(true);
  const [Series, setSeries] = useState({});
  const [ActiveSeason, setActiveSeason] = useState();
  const [Season, setSeason] = useState({});
  const [rated, setRated] = useState(1);
  const txtAreaRef = useRef();
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchSerie = async (sId) => {
    const res2 = await CSeriesAPI.getSingleSeries(sId);
    if (res2?.status === "success") {
      setSeries(res2.data.data);
      setActiveSeason(res2.data.data.seasons[0]._id);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      const res = await CSeriesAPI.GetSeriesCount(`&slug=${seriesSlug}`);
      if (res?.status === "success") {
        const sId = res.data.data[0]._id;
        fetchSerie(sId);
      }
    }
    fetchUser();
  }, []);

  const fetchSeason = async (id) => {
    const res = await CSeasonsAPI.getSingleSeason(id);
    if (res?.status === "success") {
      setSeason(res.data.data);
      //console.log(res.data.data);
    }
  };

  useEffect(() => {
    fetchSeason(ActiveSeason);
  }, [ActiveSeason]);

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

  const handelPostReview = async () => {
    const review = txtAreaRef.current.children[0].value;

    if (user) {
      if (review && rated && Series._id) {
        const res = await CSeriesAPI.CreateReviewOnSerie(
          Series._id,
          rated,
          review
        );
        // console.log(res);
        if (res?.status === "success") {
          setStatus(res.status);
          setMessage("Review Posted Successfully!");
          setshowAlert(true);
          txtAreaRef.current.children[0].value = "";
          fetchSerie(Series._id);
        } else {
          setStatus(res.status);
          setMessage(res.message);
          setshowAlert(true);
        }
      }
    } else {
      setStatus("fail");
      setMessage("You Should Login first");
      setshowAlert(true);
    }
  };

  return (
    <div>
      <PaddingTop />
      <div className="w-full h-[15rem]  sm:h-15 md:h-[30rem] lg:h-[40rem]  flex relative overflow-hidden">
        <img
          className="object-fill h-full w-full absolute inset-0 blur-sm"
          src={Series.images.posterWide[0].source}
          alt="Wide Image"
        />
        <img
          className="object-contain w-full z-10"
          src={Series.images.posterWide[0].source}
          alt="Poster Image"
        />
      </div>

      <div className="bg-black">
        <div className="ml-[4.156rem] pt-[2rem] mr-[4.156rem]">
          <Typography color="white" variant="h2">
            {Series.name}
          </Typography>
          <Typography className="text-[#d4d4d4]" variant="p">
            Arabic - Sub
          </Typography>

          <div className="flex gap-12 mt-5">
            <div>
              <Typography className="text-[#f142a2] font-bold" variant="p">
                Stars
              </Typography>
              <Rating value={Math.floor(Series.ratingsAverage)} readonly />
            </div>
            <div>
              <Typography className="text-[#f142a2] font-bold" variant="p">
                Average Rating
              </Typography>
              <Typography color="white" variant="p">
                {Series.ratingsAverage}
              </Typography>
            </div>
            <div>
              <Typography className="text-[#f142a2] font-bold" variant="p">
                Reviews
              </Typography>
              <Typography color="white" variant="p">
                {Series.ratingsQuantity}
              </Typography>
            </div>
          </div>

          <div className="flex gap-10 mt-5">
            <div>
              <Typography className="text-[#f142a2] font-bold" variant="p">
                Release Year Date
              </Typography>
              <Typography color="white" variant="p">
                {Series.launchYear}
              </Typography>
            </div>
            <div>
              <Typography className="text-[#f142a2] font-bold" variant="p">
                Completed
              </Typography>

              {Series.isCompleted ? (
                <Typography color="white" variant="p">
                  Yes
                </Typography>
              ) : (
                <Typography color="white" variant="p">
                  Not Yet
                </Typography>
              )}
            </div>
          </div>
          <div className="mt-5">
            <Typography className="text-[#f142a2] font-bold" variant="p">
              Description
            </Typography>
            <Typography color="white" variant="p">
              {Series.description}
            </Typography>
          </div>

          <div className="mt-5">
            <Typography className="text-[#f142a2] font-bold" variant="p">
              Genres
            </Typography>
            <div className="flex gap-3">
              {Series.genres.map((genre) => {
                return (
                  <Chip color={getRandomColor()} value={genre} key={genre} />
                );
              })}
            </div>
          </div>

          <hr className="mt-5" />

          <div className="mt-5 w-full">
            <Menu
              dismiss={{
                itemPress: false,
              }}
            >
              <MenuHandler className="w-full">
                <Button color="pink">Seasons Menu</Button>
              </MenuHandler>
              <MenuList className="z-[9999] w-1/2">
                {Series.seasons?.map(({ _id, name, number, episodesCount }) => (
                  <MenuItem className="p-0" key={_id}>
                    <label
                      key={_id}
                      htmlFor={`menu-v-${number}`}
                      className="flex cursor-pointer items-center gap-2 p-3"
                    >
                      <Checkbox
                        checked={ActiveSeason === _id}
                        onChange={(e) => {
                          setActiveSeason(_id);
                        }}
                        key={_id}
                        value={_id}
                        ripple={false}
                        id={`menu-v-${number}`}
                        containerProps={{ className: "p-0" }}
                        className="hover:before:content-none"
                      />
                      {`S${number} ${name}  - ${episodesCount} Episodes`}
                    </label>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>

          {Season.episodes && (
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5 p-2">
              {Season.episodes.map((ep) => {
                return (
                  <EpisodeCard key={ep?._id} episode={ep} color={"#aaa"} />
                );
              })}
            </div>
          )}

          <hr className="mt-5" />
          <div className="flex gap-3 mt-5">
            <Typography className="text-[#f142a2] font-bold" variant="p">
              Reviews
            </Typography>
            <Typography color="white" variant="p">
              ({Series.ratingsQuantity})
            </Typography>
          </div>
          {showAlert && <RaiseAlert2 state={status} message={message} />}
          <div className="mt-5">
            <Textarea
              ref={txtAreaRef}
              variant="static"
              className="text-white"
              placeholder="Your Review"
              rows={2}
            />
            <div className="w-full flex justify-between py-1.5">
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <Rating value={rated} onChange={(value) => setRated(value)} />
                  <Typography color="white" className="font-bold">
                    {rated}.0 Rated
                  </Typography>
                </div>
                <Button
                  onClick={handelPostReview}
                  size="sm"
                  className="rounded-md"
                >
                  Post Review
                </Button>
              </div>
            </div>

            {Series.reviews && (
              <div className="mt-5 grid lg:grid-cols-1 gap-6 p-5">
                {Series.reviews.map((review) => {
                  return <ReviewCard key={review?._id} review={review} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
