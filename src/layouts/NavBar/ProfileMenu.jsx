import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  PowerIcon,
  ArrowLeftOnRectangleIcon,
  PlusCircleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../context/MainContext";
import { UserAPI } from "../../API/UserAPI";
import { FilmIcon } from "@heroicons/react/24/solid";

// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
    url: "/me",
  },
  {
    label: "My Watch List",
    icon: FilmIcon,
    url: "/me/watchlist",
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
    url: "/me/edit",
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
    url: "/logout",
  },
];

const NotLoggedMenuItems = [
  {
    label: "Login",
    icon: ArrowLeftOnRectangleIcon,
    url: "/login",
  },
  {
    label: "Sign Up",
    icon: PlusCircleIcon,
    url: "/signup",
  },
];

//let MenuItems = [];

export default function ProfileMenu() {
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [userImg, setUserImg] = useState(null);
  const [MenuItems, setMenuItems] = useState(NotLoggedMenuItems);
  const { setUser, user } = useContext(MainContext);

  useEffect(() => {
    console.log("change happened: ", user);
    if (user) {
      setIsLogedIn(true);
      let pitems = [...profileMenuItems];
      if (user.role == "admin") {
        pitems = pitems.filter((el) => el.label != "My Watch List");
        pitems.unshift({
          label: "Admin Control",
          icon: WrenchScrewdriverIcon,
          url: "/me/admin/users",
        });
      }
      setUserImg(`${process.env.REACT_APP_PUBLIC_IMG_URL}${user.photo}`);
      setMenuItems(pitems);
    } else {
      setIsLogedIn(false);
      setMenuItems(NotLoggedMenuItems);
    }
  }, [user]);

  const navigateTo = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = async (url) => {
    setIsMenuOpen(false);
    if (url == "/logout") {
      const res = await UserAPI.LogOut();
      if (res?.status == "success") {
        //console.log("wants to logout bro ?", res);
        setUser(null);
        navigateTo("/home");
      }
    } else {
      navigateTo(url);
    }
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          {/* {true? (<p>yes</p>) : (<p>no</p>)} */}
          {isLogedIn ? (
            <Avatar
              variant="circular"
              size="sm"
              alt="candice wu"
              className="border border-blue-500 p-0.5"
              src={userImg}
              crossOrigin="anonymous"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          )}

          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {MenuItems.map(({ label, icon, url }, key) => {
          const isLastItem = key === MenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={() => closeMenu(url)}
              className={`flex items-center gap-2 rounded ${
                isLastItem && isLogedIn
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${
                  isLastItem && isLogedIn ? "text-red-500" : ""
                }`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem && isLogedIn ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
