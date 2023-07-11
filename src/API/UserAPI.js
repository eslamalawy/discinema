import axios from "axios";
//import { baseURL } from "./Base";

const url = process.env.REACT_APP_BASE_URL + "users";

//const navigateTo = useNavigate();
//https://betterprogramming.pub/handling-async-errors-with-axios-in-react-1e25c058a8c9
const Login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${url}/login`,
      withCredentials: true,
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const SignUp = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${url}/signup`,
      withCredentials: true,
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const Me = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: `${url}/me`,
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const LogOut = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: `${url}/logout`,
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

// type is either 'password' , or 'data'
const updateSettings = async (data, type) => {
  try {
    const postfix = type === "password" ? "/updateMyPassword" : "/updateMe";

    const res = await axios({
      method: "PATCH",
      url: `${url}${postfix}`,
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

const ForgetPassword = async (email) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${url}/forgotPassword`,
      data: {
        email,
      },
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const ResetPassword = async (id, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `${url}/resetPassword/${id}`,
      withCredentials: true,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

const DeleteUser = async () => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `${url}/deleteMe`,
      withCredentials: true,
    });

    if (res.data.status === "success") {
      return res.data;
    }
  } catch (err) {
    return err.response.data;
  }
};

export const UserAPI = {
  Login,
  Me,
  SignUp,
  LogOut,
  updateSettings,
  ForgetPassword,
  ResetPassword,
  DeleteUser,
};
