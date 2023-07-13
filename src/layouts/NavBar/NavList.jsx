import React from "react";
import NavListMenu from "./NavListMenu";

import { Typography, MenuItem } from "@material-tailwind/react";
import {
  UserCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// nav list component
const navListItems = [
  {
    label: "Account",
    icon: UserCircleIcon,
    url: "/me",
  },
  {
    label: "Search",
    icon: MagnifyingGlassIcon,
    url: "/search",
  },
];

export default function NavList() {
  const navigateTo = useNavigate();
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      <NavListMenu />
      {navListItems.map(({ url, label, icon }, key) => (
        <Typography
          key={label}
          as="a"
          href="#"
          variant="small"
          color="text-white"
          className="font-normal"
        >
          <MenuItem
            onClick={() => {
              navigateTo(url);
            }}
            className="flex items-center gap-2 lg:rounded-full"
          >
            {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
            {label}
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
}
