import React, { useContext, useEffect, useRef, useState } from "react";
import PaddingTop from "../components/PaddingTop";
import { useParams } from "react-router-dom";
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
import RaiseAlert2 from "../components/Alerts/RaiseAlert2";
import { MainContext } from "../context/MainContext";
import { CEpisodeAPI } from "../API/CEpisodeAPI";
import moment from "moment";
import CommentCard from "../components/Episode/CommentCard";

export default function SingleEpisode() {
  const { episodeSlug } = useParams();
  const { user, reply, comment } = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(true);
  const [Episode, setEpisode] = useState({});
  const txtAreaRef = useRef();
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchEpisode = async (episodeId) => {
    const res2 = await CEpisodeAPI.getSingleEpisode(episodeId);
    if (res2?.status === "success") {
      setEpisode(res2.data.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const res = await CEpisodeAPI.GetEpisodeCount(`&slug=${episodeSlug}`);
      if (res?.status === "success") {
        const episodeId = res.data.data[0]._id;
        fetchEpisode(episodeId);
      }
    }
    fetchData();
  }, []);

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

  useEffect(() => {
    fetchEpisode(Episode._id);
  }, [reply, comment]);

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

  const handelPostComment = async () => {
    const comment = txtAreaRef.current.children[0].value;
    if (user) {
      if (comment && Episode._id) {
        const res = await CEpisodeAPI.createCommentOnEpisode(
          Episode._id,
          comment
        );
        // console.log(res);
        if (res?.status === "success") {
          setStatus(res.status);
          setMessage("Comment Created Successfully!");
          setshowAlert(true);
          txtAreaRef.current.children[0].value = "";
          fetchEpisode(Episode._id);
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
          src={Episode.images.thumbnail[0].source}
          alt="Wide Image"
        />
        <img
          className="object-contain w-full z-10"
          src={Episode.images.thumbnail[0].source}
          alt="Poster Image"
        />
      </div>

      <div className="bg-black">
        <div className="ml-[4.156rem] pt-[2rem] mr-[4.156rem]">
          <Typography color="white" variant="h2">
            {Episode.name}
          </Typography>
          <Typography className="text-[#d4d4d4]" variant="p">
            Arabic - Sub
          </Typography>

          <div className="flex gap-12 mt-5">
            <div>
              <Typography className="text-[#f142a2] font-bold" variant="p">
                Number
              </Typography>
              <Typography color="white" variant="p">
                {Episode.number}
              </Typography>
            </div>
            <div>
              <Typography className="text-[#f142a2] font-bold" variant="p">
                Duration
              </Typography>
              <Typography color="white" variant="p">
                {Episode.minutes}
              </Typography>
            </div>
            <div>
              <Typography className="text-[#f142a2] font-bold" variant="p">
                Comments
              </Typography>
              <Typography color="white" variant="p">
                {Episode.commentsCount}
              </Typography>
            </div>
          </div>

          <div className="flex gap-10 mt-5">
            <div>
              <Typography className="text-[#f142a2] font-bold" variant="p">
                Type
              </Typography>
              <Typography color="white" variant="p">
                {Episode.mediaType}
              </Typography>
            </div>
            <div>
              <Typography className="text-[#f142a2] font-bold" variant="p">
                Filler
              </Typography>

              {Episode.filler ? (
                <Typography color="white" variant="p">
                  Yes
                </Typography>
              ) : (
                <Typography color="white" variant="p">
                  Have Content
                </Typography>
              )}
            </div>

            <div>
              <Typography className="text-[#f142a2] font-bold" variant="p">
                Premium
              </Typography>

              {Episode.premium ? (
                <Typography color="white" variant="p">
                  Yes
                </Typography>
              ) : (
                <Typography color="white" variant="p">
                  Free
                </Typography>
              )}
            </div>
          </div>

          <div className="mt-5">
            <Typography className="text-[#f142a2] font-bold" variant="p">
              Released on
            </Typography>
            <Typography color="white" variant="p">
              {moment(Episode.createdAt).format("dddd D/MM/YYYY")}
            </Typography>
          </div>

          <div className="mt-5">
            <Typography className="text-[#f142a2] font-bold" variant="p">
              Description
            </Typography>
            <Typography color="white" variant="p">
              {Episode.summary}
            </Typography>
          </div>

          <hr className="mt-5" />
          <div className="flex gap-3 mt-5">
            <Typography className="text-[#f142a2] font-bold" variant="p">
              Comments
            </Typography>
            <Typography color="white" variant="p">
              ({Episode.commentsCount})
            </Typography>
          </div>
          {showAlert && <RaiseAlert2 state={status} message={message} />}
          <div className="mt-5">
            <Textarea
              ref={txtAreaRef}
              variant="static"
              className="text-white"
              placeholder="Your Comment"
              rows={2}
            />
            <div className="w-full flex justify-between py-1.5">
              <div className="flex gap-2">
                <Button
                  onClick={handelPostComment}
                  size="sm"
                  className="rounded-md"
                >
                  Post Comment
                </Button>
              </div>
            </div>

            {Episode.comments && (
              <div className="mt-5 grid lg:grid-cols-1 gap-6 p-5">
                {Episode.comments.map((comment) => {
                  return <CommentCard comment={comment} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
