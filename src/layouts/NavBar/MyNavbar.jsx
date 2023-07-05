import React from "react";
import ProfileMenu from "./ProfileMenu";
import NavList from "./NavList";
import $ from 'jquery';

import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon } from "@heroicons/react/24/outline";

//  this is main function of NavBar
export default function MyNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );

    // Check if .swiperVideo class exists in the document
    const swiperVideoExists = $(".swiperVideo").length > 0;

    // Add or remove the opacity class based on the presence of .swiperVideo
    const navbarElement = $(".navBar-itm");
    if (navbarElement.length > 0) {
      if (swiperVideoExists) {
        navbarElement.addClass("opacity-[0.5]");
      } else {
        navbarElement.removeClass("opacity-[0.5]");
      }
    }
  }, []);

  return (
    <Navbar className="navBar-itm hover:opacity-[1] border-none rounded-none max-w-full bg-[#23252b;] mx-auto p-2 lg:pl-6 text-white fixed z-50">
      <div className="relative mx-auto flex items-center ">
        <IconButton
          size="sm"
          color="white"
          variant="text"
          onClick={toggleIsNavOpen}
          className="mr-2 lg:hidden"
        >
          <Bars3Icon className="h-6 w-6" />
        </IconButton>
        <Typography
          as="a"
          href="#"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-medium"
        >
          DisCinema
        </Typography>
        <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">
          <NavList />
        </div>
        <div className="ml-auto">
          <ProfileMenu />
        </div>
      </div>
      <MobileNav open={isNavOpen} className="overflow-scroll">
        <NavList />
      </MobileNav>
    </Navbar>
  );
}
