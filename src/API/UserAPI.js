import axios from "axios";
//import { baseURL } from "./Base";

const url = process.env.REACT_APP_BASE_URL + "users";

//const navigateTo = useNavigate();
//https://betterprogramming.pub/handling-async-errors-with-axios-in-react-1e25c058a8c9
export const Login = async (email, password) => {
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

export const SignUp = async (name, email, password, passwordConfirm) => {
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

export const Me = async () => {
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

export const UserAPI = {
  Login,
  Me,
  SignUp,
};

// export const logout = async () => {
//   try {
//     const res = await axios({
//       method: "GET",
//       url: "/api/v1/users/logout",
//     });

//     if (res.data.status === "success") {
//       location.reload(true);
//     }
//   } catch (error) {
//     showAlert("error", "Error logging out! Try Again.");
//   }
// };
