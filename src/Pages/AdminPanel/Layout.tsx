import React, { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import Logo from "../../assets/png/poznanskiLogo.png";
import Logo2 from "../../assets/png/logo-white.png";
import { BsList, BsSunFill, BsMoonStars } from "react-icons/bs";
import { setMode } from "../../reducers/ThemeReducer";
import "./style.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
} from "@chakra-ui/react";

interface AdminLayoutProps {
  children: ReactNode;
  component: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, component }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
  const [sideBarType, setSideBarType] = useState<boolean>(false);
  const [screenType, setScreenType] = useState<boolean>(false);
  const [modeState, setModeState] = useState<boolean>(themeMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMode = () => {
    setModeState(!modeState);
  };

  const handleSideBar = () => {
    setSideBarOpen(!sideBarOpen);
  };

  useEffect(() => {
    dispatch(setMode(modeState));
  });

  const onClose = () => {
    setSideBarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSideBarType(true);
        setSideBarOpen(false);
      } else {
        setSideBarType(false);
        setSideBarOpen(true);
      }
      if (window.innerWidth < 768) {
        setScreenType(true);
      } else {
        setScreenType(false);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`h-full flex flex-col overflow-hidden ${!modeState && "back-dark"}`}
    >
      <div className="Nav-bar">
        <div
          className={`block sm:hidden Nav-part ${!themeMode && "Nav-part-dark"} w-full`}
        ></div>
        <div
          className={`flex justify-center Nav-bar-top w-screen z-10 ${!themeMode && "Nav-bar-top-dark"}`}
        >
          <div className="flex container w-full justify-between">
            <div className={`flex gap-x-6`}>
              <div
                className="flex justify-center items-center"
                onClick={handleSideBar}
              >
                {modeState ? (
                  <BsList
                    style={
                      screenType ? { fontSize: "15px" } : { fontSize: "24px" }
                    }
                  />
                ) : (
                  <BsList
                    color="white"
                    style={
                      screenType ? { fontSize: "15px" } : { fontSize: "24px" }
                    }
                  />
                )}
              </div>

              <div className="flex-1 flex place-items-center">
                <div
                  className="mr-4 cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  <img
                    className="w-8 sm:w-16"
                    src={modeState ? Logo : Logo2}
                    alt="logo"
                  />
                </div>
              </div>
            </div>
            <div
              className="flex justify-center items-center"
              onClick={handleMode}
            >
              {modeState ? (
                <BsMoonStars
                  style={
                    screenType ? { fontSize: "15px" } : { fontSize: "24px" }
                  }
                />
              ) : (
                <BsSunFill
                  color="white"
                  style={
                    screenType ? { fontSize: "15px" } : { fontSize: "24px" }
                  }
                />
              )}
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full h-full">
        {!sideBarType && sideBarOpen && (
          <div
            className={`flex ${!modeState ? "sideBar-dark" : "sideBar"} p-1`}
          >
            {component}
          </div>
        )}
        {sideBarType && (
          <div>
            <Drawer isOpen={sideBarOpen} placement="left" onClose={onClose}>
              <DrawerContent
                backgroundColor={`${modeState ? "#E8ECFE" : "#242526"}`}
                maxWidth={250}
              >
                <div
                  className={`flex w-full h-full p-1 mt-12`}
                  style={{ width: "250px" }}
                >
                  {component}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        )}
        <div className="flex w-full h-full">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
