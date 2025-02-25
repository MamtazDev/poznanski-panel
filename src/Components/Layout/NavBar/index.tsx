import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../../assets/png/poznanskiLogo.png";
import Logo2 from "../../../assets/png/logo-white.png";
import Cup from "../../../assets/svg/cup-purple.svg";
import FaceBook from "../../../assets/svg/facebook-purple.svg";
import Instagram from "../../../assets/svg/instagram-purple.svg";
import Youtube from "../../../assets/svg/youtube-purple.svg";
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { AiOutlineClose, AiOutlineRight } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import * as common from "../../../Constant/constants";
import "./style.css";

interface NavBarProps {
  filterText?: string;
  setFilterText?: React.Dispatch<React.SetStateAction<string>>;
}

const NavBar: React.FC<NavBarProps> = (props) => {
  const menu = ["Home", "TV/Radio", "Concerts", "News", "Artists"];
  const breadcrumb = ["Home", "News", "Submit News"];
  const [selectedMenu, setSelectedMenu] = useState<string>(menu[0]);
  // const [openFilterBox, setOpenFilterBox] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [type, setType] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setType(true);
      } else {
        setType(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value);
    if (props.setFilterText) {
      props.setFilterText(e.target.value);
    }
  };

  const handleClear = () => {
    if (props.setFilterText) {
      props.setFilterText("");
    }
  };

  useEffect(() => {
    if (
      location.pathname.includes("video") ||
      location.pathname.includes("releases") ||
      location.pathname.includes("material")
    ) {
      setSelectedMenu("TV/Radio");
    } else if (location.pathname.includes("concert")) {
      setSelectedMenu("Concerts");
    } else if (location.pathname.includes("news")) {
      setSelectedMenu("News");
    } else if (location.pathname.includes("artists")) {
      setSelectedMenu("Artists");
    }
  }, [location.pathname]);

  const onClick = (value: string): void => {
    setSelectedMenu(value);
    if (value === "Home") {
      navigate(common.HOME_PATH);
    } else if (value === "TV/Radio") {
      navigate(common.TV_RADIO_PATH);
    } else if (value === "Concerts") {
      navigate(common.CONCERT_PATH);
    } else if (value === "News") {
      navigate(common.NEWS_PATH);
    } else if (value === "Artists") {
      navigate(common.ARTISTS_PATH);
    }
  };

  const onClose = (): void => {
    setOpenModal(false);
  };
  return (
    <Fragment>
      <div className="Nav-bar">
        <div
          className={`block sm:hidden Nav-part ${!themeMode && "Nav-part-dark"} w-full`}
        ></div>
        <div
          className={`Nav-bar-top ${!themeMode && "Nav-bar-top-dark"} flex place-items-center justify-center`}
        >
          <div className="grid grid-cols-2 gap-x-4 container">
            <div className="flex place-items-center">
              <img
                className="mr-4 cursor-pointer"
                src={themeMode ? Logo : Logo2}
                style={{
                  width: type ? "32px" : "59px",
                  height: type ? "32px" : "59px",
                }}
                onClick={() => navigate(common.ADMIN_PATH)}
                alt="logo"
              />
              {!type && (
                <div className="w-full">
                  <div
                    className={`filter-box ${!themeMode && "filter-box-dark"} flex place-items-center`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                    >
                      <path
                        d="M12.8334 4.5835H18.3334"
                        stroke="#BBBCC0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.8334 7.3335H15.5834"
                        stroke="#BBBCC0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.25 10.5418C19.25 15.3543 15.3542 19.2502 10.5417 19.2502C5.72921 19.2502 1.83337 15.3543 1.83337 10.5418C1.83337 5.72933 5.72921 1.8335 10.5417 1.8335"
                        stroke="#BBBCC0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20.1667 20.1668L18.3334 18.3335"
                        stroke="#BBBCC0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      className="ml-2.5 ml-peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline-none"
                      value={props.filterText ? props.filterText : ""}
                      onChange={handleChange}
                      placeholder="Search Anything"
                    ></input>
                    <div
                      className={`cursor-pointer ${props.filterText ? "block" : "hidden"}`}
                      onClick={handleClear}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="27"
                        height="26"
                        viewBox="0 0 27 26"
                        fill="none"
                      >
                        <path
                          d="M6.61914 19.5L19.859 6.5M6.61914 6.5L19.859 19.5"
                          stroke={themeMode ? "#6D6E76" : "#51525C"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden sm:block">
              <div className="flex-2 flex place-items-center h-full justify-end">
                <div className="grid grid-cols-4 gap-x-4 ">
                  <div className="cursor-pointer">
                    {themeMode ? (
                      <img src={Youtube} alt="youtube" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M7 20.75H17C18.6704 20.75 20.1207 20.1899 21.1553 19.1553C22.1899 18.1207 22.75 16.6704 22.75 15V9C22.75 7.32956 22.1899 5.87925 21.1553 4.84467C20.1207 3.81009 18.6704 3.25 17 3.25H7C5.32956 3.25 3.87925 3.81009 2.84467 4.84467C1.81009 5.87925 1.25 7.32956 1.25 9V15C1.25 16.6704 1.81009 18.1207 2.84467 19.1553C3.87925 20.1899 5.32956 20.75 7 20.75Z"
                          stroke="#21E3CE"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.3161 10.3753C14.3062 10.3687 14.2962 10.3623 14.286 10.3562L11.786 8.85621C11.1766 8.49056 10.4145 8.30401 9.75031 8.68719C9.08744 9.06961 8.8501 9.83111 8.8501 10.5993V13.5993C8.8501 14.3146 9.11606 15.0206 9.75031 15.3865C10.3907 15.7559 11.1434 15.628 11.786 15.2424L14.286 13.7424C14.2962 13.7363 14.3062 13.73 14.3161 13.7234C14.9024 13.3325 15.3251 12.7511 15.3251 12.0493C15.3251 11.3475 14.9024 10.7661 14.3161 10.3753Z"
                          stroke="#21E3CE"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="cursor-pointer">
                    {themeMode ? (
                      <img src={FaceBook} alt="facebook" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M14 9.3V12.2H16.6C16.8 12.2 16.9 12.4 16.9 12.6L16.5 14.5C16.5 14.6 16.3 14.7 16.2 14.7H14V22H11V14.8H9.3C9.1 14.8 9 14.7 9 14.5V12.6C9 12.4 9.1 12.3 9.3 12.3H11V9C11 7.3 12.3 6 14 6H16.7C16.9 6 17 6.1 17 6.3V8.7C17 8.9 16.9 9 16.7 9H14.3C14.1 9 14 9.1 14 9.3Z"
                          stroke="#21E3CE"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                        />
                        <path
                          d="M15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H15C20 2 22 4 22 9V15C22 20 20 22 15 22Z"
                          stroke="#21E3CE"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="cursor-pointer">
                    {themeMode ? (
                      <img src={Instagram} alt="instagram" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                          stroke="#21E3CE"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
                          stroke="#21E3CE"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.6361 7H17.6477"
                          stroke="#21E3CE"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="cursor-pointer">
                    {themeMode ? (
                      <img src={Cup} alt="cup" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12.1499 16.5V18.6"
                          stroke="#21E3CE"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.1499 22H17.1499V21C17.1499 19.9 16.2499 19 15.1499 19H9.1499C8.0499 19 7.1499 19.9 7.1499 21V22V22Z"
                          stroke="#21E3CE"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                        />
                        <path
                          d="M6.1499 22H18.1499"
                          stroke="#21E3CE"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 16C8.13 16 5 12.87 5 9V6C5 3.79 6.79 2 9 2H15C17.21 2 19 3.79 19 6V9C19 12.87 15.87 16 12 16Z"
                          stroke="#21E3CE"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.47004 11.6496C4.72004 11.4096 4.06004 10.9696 3.54004 10.4496C2.64004 9.44961 2.04004 8.24961 2.04004 6.84961C2.04004 5.44961 3.14004 4.34961 4.54004 4.34961H5.19004C4.99004 4.80961 4.89004 5.31961 4.89004 5.84961V8.84961C4.89004 9.84961 5.10004 10.7896 5.47004 11.6496Z"
                          stroke="#21E3CE"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.53 11.6496C19.28 11.4096 19.94 10.9696 20.46 10.4496C21.36 9.44961 21.96 8.24961 21.96 6.84961C21.96 5.44961 20.86 4.34961 19.46 4.34961H18.81C19.01 4.80961 19.11 5.31961 19.11 5.84961V8.84961C19.11 9.84961 18.9 10.7896 18.53 11.6496Z"
                          stroke="#21E3CE"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <Link to={common.CREATE_NEWS}>
                  <div
                    className={`submit-btn ${!themeMode && "submit-btn-dark"} flex place-items-center ml-4 cursor-pointer`}
                  >
                    Submit News
                  </div>
                </Link>
              </div>
            </div>
            <div className="block sm:hidden">
              <div className="flex-2 flex place-items-center h-full justify-end">
                <div className="grid grid-cols-2 gap-x-4">
                  <button
                  // onClick={() => setOpenFilterBox(true)}
                  >
                    {themeMode ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M14 5H20"
                          stroke="#252733"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 8H17"
                          stroke="#252733"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
                          stroke="#252733"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M22 22L20 20"
                          stroke="#252733"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M14 5H20"
                          stroke="#3BD6C6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 8H17"
                          stroke="#3BD6C6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
                          stroke="#3BD6C6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M22 22L20 20"
                          stroke="#3BD6C6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  <button onClick={() => setOpenModal(true)}>
                    {themeMode ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 4.5H21"
                          stroke="#252733"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 9.5H21"
                          stroke="#252733"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 14.5H21"
                          stroke="#252733"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 19.5H21"
                          stroke="#252733"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 4.5H21"
                          stroke="#3BD6C6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 9.5H21"
                          stroke="#3BD6C6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 14.5H21"
                          stroke="#3BD6C6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3 19.5H21"
                          stroke="#3BD6C6"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:block">
          <div
            className={`Nav-bar-down ${!themeMode && "Nav-bar-down-dark"} flex justify-center`}
          >
            <div className="flex">
              {menu.map((item, idx) => (
                <div
                  key={`nav-btn-${idx}`}
                  className={`Nav-btn ${!themeMode && "Nav-btn-dark"} ${item === selectedMenu && (themeMode ? "selected-menu" : "selected-menu-dark")}`}
                  onClick={() => onClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal onClose={onClose} size="full" isOpen={openModal}>
        <ModalOverlay />
        <ModalContent
          className={`container flex flex-col justify-between ${!themeMode && "back-dark"}`}
        >
          <div>
            <div className="w-full h-11"></div>
            <div className="flex justify-between mb-4">
              <div className="mr-4 cursor-pointer">
                <img
                  className="w-10 sm:w-auto"
                  src={themeMode ? Logo : Logo2}
                  alt="logo"
                />
              </div>
              <div className="flex items-center" onClick={onClose}>
                <AiOutlineClose size={24} color={themeMode ? "" : "#FFF"} />
              </div>
            </div>
            <div className="flex justify-center mb-10">
              {breadcrumb.map((item, idx) => {
                return (
                  <div key={`breadcrumb-${idx}`} className="flex">
                    <div
                      className={`mx-3 breadcrumb-text ${!themeMode && "textWhite"} ${idx === breadcrumb.length - 1 && (themeMode ? "selected-text-color" : "text-dark-color")}`}
                    >
                      {item}
                    </div>
                    {idx !== breadcrumb.length - 1 && (
                      <div className="flex items-center">
                        <AiOutlineRight size={16} color="#9B9CA1" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center mb-10">
              <div className="grid grid-cols-1 gap-y-10">
                {menu.map((item, idx) => (
                  <div
                    key={`nav-vertical-btn-${idx}`}
                    className={`Nav-vertical-btn text-center ${item === selectedMenu && (themeMode ? "selected-menu" : "text-dark-color")}`}
                    onClick={() => onClick(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-4 gap-x-8">
                <div className="cursor-pointer">
                  {themeMode ? (
                    <img src={Youtube} alt="youtube" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M7 20.75H17C18.6704 20.75 20.1207 20.1899 21.1553 19.1553C22.1899 18.1207 22.75 16.6704 22.75 15V9C22.75 7.32956 22.1899 5.87925 21.1553 4.84467C20.1207 3.81009 18.6704 3.25 17 3.25H7C5.32956 3.25 3.87925 3.81009 2.84467 4.84467C1.81009 5.87925 1.25 7.32956 1.25 9V15C1.25 16.6704 1.81009 18.1207 2.84467 19.1553C3.87925 20.1899 5.32956 20.75 7 20.75Z"
                        stroke="#2FC4B2"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.316 10.3753C14.3061 10.3687 14.296 10.3623 14.2858 10.3562L11.7858 8.85621C11.1764 8.49056 10.4143 8.30401 9.75018 8.68719C9.08732 9.06961 8.84998 9.83111 8.84998 10.5993V13.5993C8.84998 14.3146 9.11594 15.0206 9.75018 15.3865C10.3906 15.7559 11.1433 15.628 11.7858 15.2424L14.2858 13.7424C14.296 13.7363 14.3061 13.73 14.316 13.7234C14.9023 13.3325 15.325 12.7511 15.325 12.0493C15.325 11.3475 14.9023 10.7661 14.316 10.3753Z"
                        stroke="#2FC4B2"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div className="cursor-pointer">
                  {themeMode ? (
                    <img src={FaceBook} alt="facebook" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M14 9.3V12.2H16.6C16.8 12.2 16.9 12.4 16.9 12.6L16.5 14.5C16.5 14.6 16.3 14.7 16.2 14.7H14V22H11V14.8H9.3C9.1 14.8 9 14.7 9 14.5V12.6C9 12.4 9.1 12.3 9.3 12.3H11V9C11 7.3 12.3 6 14 6H16.7C16.9 6 17 6.1 17 6.3V8.7C17 8.9 16.9 9 16.7 9H14.3C14.1 9 14 9.1 14 9.3Z"
                        stroke="#2FC4B2"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                      />
                      <path
                        d="M15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H15C20 2 22 4 22 9V15C22 20 20 22 15 22Z"
                        stroke="#2FC4B2"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div className="cursor-pointer">
                  {themeMode ? (
                    <img src={Instagram} alt="instagram" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                        stroke="#2FC4B2"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
                        stroke="#2FC4B2"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.6361 7H17.6477"
                        stroke="#2FC4B2"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div className="cursor-pointer">
                  {themeMode ? (
                    <img src={Cup} alt="cup" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12.15 16.5V18.6"
                        stroke="#2FC4B2"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.15002 22H17.15V21C17.15 19.9 16.25 19 15.15 19H9.15002C8.05002 19 7.15002 19.9 7.15002 21V22V22Z"
                        stroke="#2FC4B2"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                      />
                      <path
                        d="M6.15002 22H18.15"
                        stroke="#2FC4B2"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 16C8.13 16 5 12.87 5 9V6C5 3.79 6.79 2 9 2H15C17.21 2 19 3.79 19 6V9C19 12.87 15.87 16 12 16Z"
                        stroke="#2FC4B2"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.47004 11.6496C4.72004 11.4096 4.06004 10.9696 3.54004 10.4496C2.64004 9.44961 2.04004 8.24961 2.04004 6.84961C2.04004 5.44961 3.14004 4.34961 4.54004 4.34961H5.19004C4.99004 4.80961 4.89004 5.31961 4.89004 5.84961V8.84961C4.89004 9.84961 5.10004 10.7896 5.47004 11.6496Z"
                        stroke="#2FC4B2"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.53 11.6496C19.28 11.4096 19.94 10.9696 20.46 10.4496C21.36 9.44961 21.96 8.24961 21.96 6.84961C21.96 5.44961 20.86 4.34961 19.46 4.34961H18.81C19.01 4.80961 19.11 5.31961 19.11 5.84961V8.84961C19.11 9.84961 18.9 10.7896 18.53 11.6496Z"
                        stroke="#2FC4B2"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Link to={common.CREATE_NEWS}>
            <div className="flex items-center mb-6">
              <div
                className={`submit-btn-2 flex place-items-center w-full cursor-pointer ${!themeMode && "btn-dark-bg-color btn-dark-color"}`}
              >
                Submit News
              </div>
            </div>
          </Link>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default NavBar;
