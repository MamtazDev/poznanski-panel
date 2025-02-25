import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiCircle } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { logoutRequest } from "../../Constant/api-functions";

const mainMenu = [
  { icon: <BiCircle />, text: "Article", link: "article" },
  { icon: <BiCircle />, text: "Propossed Article", link: "propossedArticle" },
  { icon: <BiCircle />, text: "TV/Radio", link: "radio" },
  { icon: <BiCircle />, text: "Material", link: "material" },
  {
    icon: <BiCircle />,
    text: "Playlist",
    link: "playlist",
  },
  { icon: <BiCircle />, text: "Concerts", link: "concerts" },
  { icon: <BiCircle />, text: "Artists", link: "artists" },
  { icon: <BiCircle />, text: "User", link: "user" },
];

const Menu = () => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [selectedMenu, setSelectedMenu] = useState(
    sessionStorage.getItem("selectedMenu") || "article"
  );
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutRequest();
    navigate("/login");
  };
  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    setSelectedMenu(currentPath || "article"); // Default to "article"
  }, [location]);

  useEffect(() => {
    sessionStorage.setItem("selectedMenu", selectedMenu);
  }, [selectedMenu]);

  return (
    <div className="flex flex-col gap-1 w-full px-5">
      {mainMenu.map((item, idx) => (
        <Link key={idx} to={`/admin/${item.link}`}>
          <div
            className={`flex gap-3 justify-start items-center w-full cursor-pointer p-2.5 side-menu
              ${selectedMenu === item.link ? "side-menu-selected" : ""}
              ${!themeMode ? "side-menu-dark" : ""}`}
            onClick={() => setSelectedMenu(item.link)}>
            {item.icon}
            <div>{item.text}</div>
          </div>
        </Link>
      ))}
      <button className="bg-red-300 p-2 rounded" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Menu;
