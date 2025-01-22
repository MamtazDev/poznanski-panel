import React from "react";
import ModeSwitch from "../Switch/ModeSwitch";
import WujoLogo from "../../assets/png/wujo.png";
import TopImg from "../../assets/svg/Top-back.svg";
import "./style.css";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

interface MainBackProps {
  scrollToBottom: () => void;
}

const MainBack: React.FC<MainBackProps> = ({ scrollToBottom }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  return (
    <div className="flex w-full relative overflow-hidden">
      <div className="absolute w-screen z-10 flex md:bottom-16 bottom-8 justify-center overflow-hidden">
        <img src={TopImg} className="w-full" alt="top-back" />
      </div>
      <div
        className={`${themeMode ? "background" : "background-dark"} flex flex-col justify-between md:py-5 py-1`}
      >
        <div className="z-10 mt-4 md:mt-5">
          <div className="flex justify-center">
            <ModeSwitch />
          </div>
          <div className="my-3 md:my-7">
            <h1
              className={`text-xl md:text-5xl ${!themeMode && "text-dark-color"} font-semibold main-board-text md:mb-4 mb-1`}
            >
              The Rap Insider:
            </h1>
            <h1 className="text-xl md:text-5xl font-normal main-board-text text-white">
              Uncovering the Hottest Stories and Events
            </h1>
          </div>
          <div className="flex justify-center">
            <img className="wujo-logo" src={WujoLogo} alt="wujo-Logo" />
          </div>
        </div>
        <div className="flex justify-center ">
          <div
            className="flex md:w-7 w-3 cursor-pointer animate-bounce hover:animate-none"
            onClick={scrollToBottom}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="29"
              height="28"
              viewBox="0 0 29 28"
              fill="none"
            >
              <path
                d="M22.6668 14L14.5002 22.1667L6.3335 14"
                stroke="#F1F4F9"
                strokeWidth="3.29412"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBack;
