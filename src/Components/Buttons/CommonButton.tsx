import React from "react";
import { Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

const CommonButton: React.FC<ButtonProps> = ({ text, onClick }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  return (
    <Button
      className={` ${!themeMode ? "detail-btn-dark-2" : "detail-btn-2"}`}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default CommonButton;
