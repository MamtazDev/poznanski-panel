import React from "react";
import { Button } from "@chakra-ui/react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";

interface ButtonProps {
  text: string;
  btnType: string;
  onClick?: () => void;
}

const DetailButton: React.FC<ButtonProps> = ({ text, btnType, onClick }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  return btnType === "web" ? (
    <Button
      rightIcon={<AiOutlineArrowRight size={24} />}
      className={` ${!themeMode ? "detail-btn-dark" : "detail-btn"}`}
      onClick={onClick && onClick}
    >
      {text}
    </Button>
  ) : (
    <Button
      rightIcon={<AiOutlineArrowRight size={24} />}
      className={` ${themeMode ? "mobile-detail-btn" : "mobile-detail-btn-dark"}`}
      fontSize={"14px"}
      onClick={onClick && onClick}
    >
      {text}
    </Button>
  );
};

export default DetailButton;
