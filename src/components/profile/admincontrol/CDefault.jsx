import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { MainContext } from "../../../context/MainContext";

export default function CDefault() {
  const [Admin, setAdmin] = useState(false);
  const { user } = useContext(MainContext);
  const navigateTo = useNavigate();
  const navigate = (url) => {
    navigateTo(url);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      if (user?.role == "admin") {
        setAdmin(true);
      } else {
        setAdmin(false);
        navigate("/login");
      }
    }
  }, []);

  return (
    <div>
      <div>{Admin && <Outlet />}</div>
    </div>
  );
}
