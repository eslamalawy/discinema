import axios from "axios";
const url = process.env.REACT_APP_BASE_URL + "video";

const GetVideosCount = async (filter) => {
  try {
    const res = await axios({
      method: "GET",
      url: filter ? `${url}?fields=${filter}` : `${url}`,
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const GetAllVideos = async (page, filter) => {
  try {
    const res = await axios({
      method: "GET",
      url: filter
        ? `${url}?page=${page}&limit=10${filter}`
        : `${url}?page=${page}&limit=10`,
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const CreateVideo = async (vids, episode, series, logo) => {
  const data = { vids };
  if (episode) {
    data.episode = episode;
  }
  if (series) {
    data.series = series;
    data.logo = logo;
  }

  try {
    const res = await axios({
      method: "POST",
      url,
      data,
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const DeleteVideo = async (id) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `${url}/${id}`,
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const UpdateVideo = async (id, vids, episode, series, logo) => {
  const data = { vids };
  if (episode) {
    data.episode = episode;
  }
  if (series) {
    data.series = series;
    data.logo = logo;
  }

  try {
    const res = await axios({
      method: "PATCH",
      url: `${url}/${id}`,
      data,
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

export const CVideoAPI = {
  GetVideosCount,
  GetAllVideos,
  DeleteVideo,
  CreateVideo,
  UpdateVideo,
};
