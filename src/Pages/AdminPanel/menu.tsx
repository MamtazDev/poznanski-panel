import React from "react";
import { Link } from "react-router-dom";
import { BiCircle } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

const mainMenu = [
  {
    icon: <BiCircle />,
    text: "Article",
    link: "article",
  },
  {
    icon: <BiCircle />,
    text: "TV/Radio",
    link: "radio",
  },
  {
    icon: <BiCircle />,
    text: "Material",
    link: "material",
  },
  // {
  //   icon: <BiCircle />,
  //   text: "Top Rated",
  //   link: "top-rated",
  // },
  {
    icon: <BiCircle />,
    text: "Concerts",
    link: "concerts",
  },
  {
    icon: <BiCircle />,
    text: "Artists",
    link: "artists",
  },
  {
    icon: <BiCircle />,
    text: "Partner Logos",
    link: "logos",
  },
];

interface MenuProps {
  selectedMenu: string;
  setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
}

const Menu: React.FC<MenuProps> = ({ selectedMenu, setSelectedMenu }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  const handleClick = (value: string) => {
    setSelectedMenu(value);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {mainMenu.map((item, idx) => (
        <Link to={`/admin/${item.link}`}>
          <div
            key={`side-menu-${idx}`}
            className={`flex gap-3 justify-start items-center w-full cursor-pointer p-2.5 side-menu ${selectedMenu === item.link && "side-menu-selected"} ${!themeMode && "side-menu-dark"} `}
            onClick={() => handleClick(item.link)}
          >
            {item.icon}
            <div>{item.text}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Menu;
