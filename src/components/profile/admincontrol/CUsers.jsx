import React, { useEffect, useState, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  Checkbox,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Select,
  Option,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { CUserAPI } from "../../../API/CUsersAPI";
import RaiseAlert2 from "../../Alerts/RaiseAlert2";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Admins",
    value: "admins",
  },
  {
    label: "Users",
    value: "users",
  },
];

const TABLE_HEAD = ["Member", "Role", "Status", "Edit", "Delete"];

export default function CUsers() {
  const [TABLE_ROWS, setTABLE_ROWS] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState(0);
  const [filters, setFilters] = useState(null);

  //Alert info
  const [showAlert, setshowAlert] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);

  //Search info
  const [SearchBy, SetSearchBy] = useState("name");
  const SearchRef = useRef(null);

  //Dialog Info
  const [DialogTitle, SetDialogTitle] = useState(null);
  const [DialogId, SetDialogId] = useState(null);
  const [DialogEmail, SetDialogEmail] = useState(null);
  const [DialogName, SetDialogName] = useState(null);
  const [DialogRole, SetDialogRole] = useState(null);
  const [DialogStatus, SetDialogStatus] = useState(false);
  const [DialogPic, SetDialogPic] = useState(null);
  const [DialogAction, SetDialogAction] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = (title, id, email, name, role, status, pic, action) => {
    setOpen(!open);
    SetDialogTitle(title);
    SetDialogId(id);
    SetDialogEmail(email);
    SetDialogName(name);
    SetDialogRole(role);
    SetDialogStatus(status);
    SetDialogAction(action);
    SetDialogPic(pic);
  };

  const handelDialogConfirm = async () => {
    if (DialogAction == "delete") {
      const res = await CUserAPI.DelUser(DialogId);

      if (!res) {
        setMessage("User Deleted Successfully!");
        setStatus("success");
        setshowAlert(true);
        fetchUsersCount(filters);
        fetchUsers(currentPage, filters);
      } else {
        setStatus(res?.status);
        setMessage(res?.message);
        setshowAlert(true);
      }
    } else if (DialogAction == "edit") {
      const res = await CUserAPI.UpdateUser(
        DialogId,
        DialogName,
        DialogEmail,
        DialogRole,
        DialogStatus
      );
      if (res?.status == "success") {
        setMessage("User Updated Successfully!");
        setStatus(res?.status);
        setshowAlert(true);
        fetchUsersCount(filters);
        fetchUsers(currentPage, filters);
      } else {
        setStatus(res?.status);
        setMessage(res?.message);
        setshowAlert(true);
      }
    }

    setOpen(!open);
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setshowAlert(false);
      }, 2400);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [showAlert]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };
  const fetchUsers = async (actualpage, filter) => {
    const res = await CUserAPI.GetAllUsers(actualpage, filter);
    if (res?.status === "success") {
      setResults(res?.results);
      setTABLE_ROWS(res?.data?.data);
    }
  };

  const fetchUsersCount = async (filter) => {
    const res_usersCount = await CUserAPI.GetUsersCount(filter);
    if (res_usersCount?.status === "success") {
      setUsersCount(res_usersCount?.results);
      // Calculate the page count
      const count = Math.ceil(res_usersCount?.results / 10);
      setPageCount(count);
    }
  };

  useEffect(() => {
    fetchUsersCount(null);
    fetchUsers(currentPage, null);
  }, []);

  const handelSearch = () => {
    const searchText = SearchRef.current.children[1].value;
    const filter_search = `${filters}&${SearchBy}=${searchText}`
    // console.log(filter_search)
    setFilters(filter_search)
  };

  const tabClick = (tab) => {
    // console.log("i'm on", tab);
    if (tab == "all") {
      setFilters(null);
      setCurrentPage(1);
    } else if (tab == "admins") {
      setFilters("&role=admin");
      setCurrentPage(1);
    } else if (tab == "users") {
      setFilters("&role=user");
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchUsersCount(filters);
    fetchUsers(currentPage, filters);
  }, [filters, currentPage]);

  return (
    <Card className="h-full w-full">
      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>{DialogTitle}</DialogHeader>
        <DialogBody divider>
          <div className="flex justify-center">
            <Avatar
              className="mb-3 "
              crossOrigin="anonymous"
              src={`${process.env.REACT_APP_PUBLIC_IMG_URL}${DialogPic}`}
              size="xl"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Input
              onChange={(e) => {
                SetDialogName(e.target.value);
              }}
              label="Name"
              value={DialogName}
            />
            <Input
              onChange={(e) => {
                SetDialogEmail(e.target.value);
              }}
              label="Email"
              value={DialogEmail}
            />
            <Input
              onChange={(e) => {
                SetDialogRole(e.target.value);
              }}
              label="Role"
              value={DialogRole}
            />
            <div className="flex">
              <p className="mt-auto mb-auto">Active: </p>
              <Checkbox
                checked={DialogStatus}
                onClick={() => {
                  SetDialogStatus(!DialogStatus);
                }}
                ripple={false}
                className="rounded-full w-8 h-8 hover:before:opacity-0 hover:scale-105 bg-blue-500/25 border-blue-500/50 transition-all"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handelDialogConfirm}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              {`Users list [${usersCount} Total Users]`}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              {`See information about ${results} users`}
            </Typography>
          </div>
          {showAlert && <RaiseAlert2 state={status} message={message} />}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value="all" className="w-full md:w-max">
            <TabsHeader>
              {TABS.map(({ label, value }) => (
                <Tab
                  onClick={() => {
                    tabClick(value);
                  }}
                  key={value}
                  value={value}
                >
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <div className="w-full md:w-1/2  flex">
            <Select value={SearchBy} label="Search By">
              <Option
                onClick={() => {
                  SetSearchBy("email");
                }}
                value={"email"}
              >
                email
              </Option>
              <Option
                onClick={() => {
                  SetSearchBy("name");
                }}
                value={"name"}
              >
                name
              </Option>
            </Select>

            <Input
              ref={SearchRef}
              label="Search"
              icon={
                <MagnifyingGlassIcon
                  onClick={handelSearch}
                  className="h-5 w-5 hover:text-orange-600 hover:h-6 hover:w-6 cursor-pointer"
                />
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(
              ({ _id, photo, name, email, role, active }, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={_id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          crossOrigin="anonymous"
                          src={`${process.env.REACT_APP_PUBLIC_IMG_URL}${photo}`}
                          alt={name}
                          size="sm"
                        />
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            {email}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color={role == "admin" ? "red" : "blue-gray"}
                        className="font-normal"
                      >
                        {role}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={active ? "Active" : "Disabled"}
                          color={active ? "green" : "blue-gray"}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit User">
                        <IconButton
                          onClick={() => {
                            handleOpen(
                              "Edit User",
                              _id,
                              email,
                              name,
                              role,
                              active,
                              photo,
                              "edit"
                            );
                          }}
                          variant="text"
                          color="blue-gray"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Delete User">
                        <IconButton
                          onClick={() => {
                            handleOpen(
                              "Delete User",
                              _id,
                              email,
                              name,
                              role,
                              active,
                              photo,
                              "delete"
                            );
                          }}
                          variant="text"
                          color="red"
                        >
                          <TrashIcon className=" h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          {`Page ${currentPage} of ${pageCount}`}
        </Typography>
        <div className="flex gap-2">
          <Button
            onClick={handlePrevious}
            variant="outlined"
            color="blue-gray"
            size="sm"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            variant="outlined"
            color="blue-gray"
            size="sm"
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
