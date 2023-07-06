import React from "react";
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
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  ArrowLeftOnRectangleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
    url: "/me",
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
    url: "/me/edit",
  },
  {
    label: "Inbox",
    icon: InboxArrowDownIcon,
    url: "/inbox",
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
    url: "/help",
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

let MenuItems = [];

export default function ProfileMenu() {
  const navigateTo = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const closeMenu = (url) => {
    setIsMenuOpen(false);
    navigateTo(url);
  };
  const isLogedIn = true;
  if (isLogedIn) {
    MenuItems = profileMenuItems;
  } else {
    MenuItems = NotLoggedMenuItems;
  }

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
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
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
