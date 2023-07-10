import axios from "axios";
const url = process.env.REACT_APP_BASE_URL + "users";

const GetUsersCount = async (filter) => {
  try {
    const res = await axios({
      method: "GET",
      url: filter
        ? `${url}?fields=name,email,photo,role,active${filter}`
        : `${url}?fields=name,email,photo,role,active`,
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const GetAllUsers = async (page, filter) => {
  try {
    const res = await axios({
      method: "GET",
      url: filter
        ? `${url}?fields=name,email,photo,role,active&page=${page}&limit=10${filter}`
        : `${url}?fields=name,email,photo,role,active&page=${page}&limit=10`,
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const DelUser = async (id) => {
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

const UpdateUser = async (id, name, email, role, active) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `${url}/${id}`,
      data: {
        name,
        email,
        role,
        active,
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

export const CUserAPI = { GetUsersCount, GetAllUsers, DelUser, UpdateUser };
