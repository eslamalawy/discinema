import axios from "axios";
const url = process.env.REACT_APP_BASE_URL + "episode";

const GetEpisodeCount = async (filter) => {
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

const GetAllEpisodes = async (page, filter) => {
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

const UpdateEpisode = async (
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
  minutes
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `${url}/${id}`,
      data: {
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
      },
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const CreateEpisode = async (
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
  minutes
) => {
  try {
    const res = await axios({
      method: "POST",
      url,
      data: {
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
      },
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const DeleteEpisode = async (id) => {
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

const getSingleEpisode = async (id) => {
  try {
    const res = await axios({
      method: "GET",
      url: `${url}/${id}`,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const createCommentOnEpisode = async (id, comment) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${url}/${id}/comments`,
      data: {
        comment,
      },
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const createReplyOnCommentOfEpisode = async (id, comment, reply) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${url}/${id}/comment/${comment}/reply`,
      data: {
        reply,
      },
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

export const CEpisodeAPI = {
  GetEpisodeCount,
  GetAllEpisodes,
  UpdateEpisode,
  CreateEpisode,
  DeleteEpisode,
  getSingleEpisode,
  createCommentOnEpisode,
  createReplyOnCommentOfEpisode
};
