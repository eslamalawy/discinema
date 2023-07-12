import axios from "axios";
const url = process.env.REACT_APP_BASE_URL + "replies";

const GetRepliesCount = async (filter) => {
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

const GetAllReplies = async (page, filter) => {
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

const DeleteReply = async (id) => {
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

const UpdateReply = async (id, reply) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `${url}/${id}`,
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

export const CReplyAPI = {
  GetAllReplies,
  GetRepliesCount,
  DeleteReply,
  UpdateReply,
};
