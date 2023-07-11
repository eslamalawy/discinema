import axios from "axios";
const url = process.env.REACT_APP_BASE_URL + "series";

const GetSeriesCount = async (filter) => {
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

const GetAllSeries = async (page, filter) => {
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

const UpdateSeries = async (
  id,
  name,
  description,
  isCompleted,
  launchYear,
  images,
  keywords,
  genres
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `${url}/${id}`,
      data: {
        name,
        description,
        isCompleted,
        launchYear,
        images,
        keywords,
        genres,
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

const CreateSeries = async (
  name,
  description,
  isCompleted,
  launchYear,
  images,
  keywords,
  genres
) => {
  try {
    const res = await axios({
      method: "POST",
      url,
      data: {
        name,
        description,
        isCompleted,
        launchYear,
        images,
        keywords,
        genres,
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



const DeleteSeries = async (id) => {
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


export const CSeriesAPI = {
  GetSeriesCount,
  GetAllSeries,
  UpdateSeries,
  CreateSeries,DeleteSeries
};
