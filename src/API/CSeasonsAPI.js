import axios from "axios";
const url = process.env.REACT_APP_BASE_URL + "season";

const GetSeasonsCount = async (filter) => {
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

const GetAllSseasons = async (page, filter) => {
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

const CreateSeason = async (name, number, series) => {
  try {
    const res = await axios({
      method: "POST",
      url,
      data: {
        name,
        series,
        number,
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

const DeleteSeason = async (id) => {
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

const UpdateSeason = async (id, name, number, series) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `${url}/${id}`,
      data: {
        name,
        number,
        series,
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

const getSingleSeason = async (id) => {
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

export const CSeasonsAPI = {
  GetSeasonsCount,
  GetAllSseasons,
  CreateSeason,
  DeleteSeason,
  UpdateSeason,
  getSingleSeason
};
