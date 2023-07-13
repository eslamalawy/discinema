import React from "react";
import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Card,
} from "@material-tailwind/react";
import {
  Square3Stack3DIcon,
  ChevronDownIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
// nav list menu
const navListMenuItems = [
  {
    title: "All Series",
    description: "Go a head and browse all amazing series",
    url: "/series",
  },
  {
    title: "Home",
    description:
      "Where everything begins",
    url: "/",
  },
];

export default function NavListMenu() {
  const navigateTo = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const triggers = {
    onClick: () => {
      setIsMenuOpen(true);
    },
  };

  React.useEffect(() => {
    let my_overlay = document.getElementById("overlay-elements");
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      my_overlay.classList.remove("hidden");
    } else {
      setIsMenuOpen(false);
      document.body.style.overflow = "";
      my_overlay.classList.add("hidden");
    }
  }, [isMenuOpen]);

  const renderItems = navListMenuItems.map(({ url, title, description }) => (
    <a
      onClick={() => {
        setIsMenuOpen(!isMenuOpen);
        navigateTo(url);
      }}
      key={title}
    >
      <MenuItem>
        <Typography variant="h6" className="mb-1  text-[#86198f]">
          {title}
        </Typography>
        <Typography variant="small" className="font-normal text-[#4f46e5]">
          {description}
        </Typography>
      </MenuItem>
    </a>
  ));

  return (
    <React.Fragment>
      <Menu open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem
              {...triggers}
              className="hidden items-center gap-2 text-white lg:flex lg:rounded-full"
            >
              <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Browse{" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList
          {...triggers}
          className="hidden w-full grid-cols-7 gap-3 overflow-visible lg:grid"
        >
          {/* <Card
            color="green"
            shadow={false}
            variant="gradient"
            className="col-span-3 grid h-full w-full place-items-center rounded-md"
          >
            <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
          </Card> */}
          {/* <ul className="col-span-4 flex w-full flex-col gap-1">
            {renderItems}
          </ul> */}
          <ul className="col-span-7 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      {/* mobile view --- view */}
      <MenuItem className="flex items-center gap-2 text-blue-gray-200 lg:hidden">
        <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Browse{" "}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden ">
        {renderItems}
      </ul>
    </React.Fragment>
  );
}
