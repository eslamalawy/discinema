import React, { useState, useContext, useEffect } from "react";
import PaddingTop from "../components/PaddingTop";
import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import { XMarkIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { useNavigate, Outlet } from "react-router-dom";
import { MainContext } from "../context/MainContext";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  StarIcon,
  KeyIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid";

export default function MePage() {
  const [openLeft, setOpenLeft] = useState(false);
  const [Admin, setAdmin] = useState(false);
  const openDrawerLeft = () => setOpenLeft(true);
  const closeDrawerLeft = () => setOpenLeft(false);
  const navigateTo = useNavigate();
  const navigate = (url) => {
    closeDrawerLeft();
    navigateTo(url);
  };
  const { user } = useContext(MainContext);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    if (user?.role == "admin") {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, []);

  return (
    <div>
      <PaddingTop />

      <div>
        <Outlet />
      </div>

      <div className="fixed top-1/2 left-0 ml-1  z-10">
        <IconButton
          className="rounded-full"
          color="gray"
          onClick={openDrawerLeft}
        >
          <EyeIcon strokeWidth={2} className="h-5 w-5" />
        </IconButton>
      </div>

      <Drawer
        placement="left"
        open={openLeft}
        onClose={closeDrawerLeft}
        className=""
      >
        <div className="pt-4 pr-4 pl-4 mb-6 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Profile
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={closeDrawerLeft}
          >
            <XMarkIcon strokeWidth={2} className="h-5 w-5" />
          </IconButton>
        </div>

        <div>
          {/* Content */}
          <Card className="rounded-none w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
            <List>
              <ListItem
                onClick={() => {
                  navigate("/me");
                }}
              >
                <ListItemPrefix>
                  <UserCircleIcon className="h-5 w-5" />
                </ListItemPrefix>
                Profile
              </ListItem>

              <ListItem
                onClick={() => {
                  navigate("/me/edit");
                }}
              >
                <ListItemPrefix>
                  <Cog6ToothIcon className="h-5 w-5" />
                </ListItemPrefix>
                Settings
              </ListItem>

              <ListItem
                onClick={() => {
                  navigate("/me/password");
                }}
              >
                <ListItemPrefix>
                  <KeyIcon className="h-5 w-5" />
                </ListItemPrefix>
                Change Password
              </ListItem>

              {!Admin && (
                <ListItem
                  onClick={() => {
                    navigate("/me/reviews");
                  }}
                >
                  <ListItemPrefix>
                    <StarIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  My Reviews
                </ListItem>
              )}

              {Admin && (
                <div className=" mt-2">
                  <hr />
                  <Typography
                    className=" mt-1 text-center"
                    variant="h6"
                    color="blue"
                  >
                    Admin Control
                  </Typography>

                  <ListItem
                    onClick={() => {
                      navigate("/me/admin/users");
                    }}
                  >
                    <ListItemPrefix>
                      <WrenchScrewdriverIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Control Users
                  </ListItem>

                  <ListItem
                    onClick={() => {
                      navigate("/me/admin/series");
                    }}
                  >
                    <ListItemPrefix>
                      <WrenchScrewdriverIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Control Series
                  </ListItem>
                </div>
              )}
            </List>
          </Card>
        </div>
      </Drawer>
    </div>
  );
}
