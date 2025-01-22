import { IconButton } from "@chakra-ui/react";
import React, { useState, ChangeEvent } from "react";
import { Input } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import {
  BsChevronDoubleRight,
  BsChevronDoubleLeft,
  BsChevronRight,
  BsChevronLeft,
} from "react-icons/bs";

interface PaginationProps {
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
  pages: string;
}

const PaginationBar: React.FC<PaginationProps> = ({
  selectedPage,
  setSelectedPage,
  pages,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  const handleDecrease = () => {
    if (parseInt(selectedPage) > 1) {
      const value = parseInt(selectedPage) - 1;
      setSelectedPage(value.toString());
    }
  };

  const handleIncrease = () => {
    if (parseInt(selectedPage) <= parseInt(pages)) {
      const value = parseInt(selectedPage) + 1;
      setSelectedPage(value.toString());
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedPage(e.target.value);
  };

  return (
    <div className="flex gap-2">
      <IconButton
        aria-label="PrevBtn"
        variant={themeMode ? "outline" : ""}
        icon={
          <BsChevronDoubleLeft
            size={12}
            color={!themeMode ? "white" : "#6D6E76"}
          />
        }
        isDisabled={
          selectedPage === "1" || parseInt(selectedPage) < 1 ? true : false
        }
        backgroundColor={themeMode ? "#FFF" : "#242526"}
        color={themeMode ? "#252733" : "#FFF"}
        border={themeMode ? "border: 1px solid #E9EBF0" : "unset"}
        width="40px"
        height="30px"
        onClick={() => setSelectedPage("1")}
      />
      <IconButton
        aria-label="PrevBtn"
        variant={themeMode ? "outline" : ""}
        isDisabled={
          selectedPage === "1" || parseInt(selectedPage) < 1 ? true : false
        }
        icon={
          <BsChevronLeft size={12} color={!themeMode ? "white" : "#6D6E76"} />
        }
        color={themeMode ? "#252733" : "#FFF"}
        backgroundColor={themeMode ? "#FFF" : "#242526"}
        border={themeMode ? "1px solid #E9EBF0" : "unset"}
        width="40px"
        height="30px"
        onClick={() => handleDecrease()}
      />
      <div>
        <Input
          value={selectedPage}
          width={"55px"}
          height={"30px"}
          onChange={handleChange}
          backgroundColor={themeMode ? "#FFF" : "#242526"}
          color={themeMode ? "#252733" : "#FFF"}
          border={themeMode ? "1px solid #E9EBF0" : "unset"}
          textAlign="center"
        />
      </div>
      <div
        className={`flex items-center ${themeMode ? "entire-page" : "entire-page-2 text-gray-50"}`}
      >
        of {pages}
      </div>
      <IconButton
        aria-label="PrevBtn"
        variant={themeMode ? "outline" : ""}
        isDisabled={
          selectedPage === pages || parseInt(selectedPage) > parseInt(pages)
            ? true
            : false
        }
        backgroundColor={themeMode ? "#FFF" : "#242526"}
        color={themeMode ? "#252733" : "#FFF"}
        border={themeMode ? "1px solid #E9EBF0" : "unset"}
        width="40px"
        height="30px"
        icon={
          <BsChevronRight size={12} color={!themeMode ? "white" : "#6D6E76"} />
        }
        onClick={() => handleIncrease()}
      />
      <IconButton
        aria-label="PrevBtn"
        variant={themeMode ? "outline" : ""}
        icon={
          <BsChevronDoubleRight
            size={12}
            color={!themeMode ? "white" : "#6D6E76"}
          />
        }
        isDisabled={
          selectedPage === pages || parseInt(selectedPage) > parseInt(pages)
            ? true
            : false
        }
        backgroundColor={themeMode ? "#FFF" : "#242526"}
        color={themeMode ? "#252733" : "#FFF"}
        border={themeMode ? "1px solid #E9EBF0" : "unset"}
        width="40px"
        height="30px"
        onClick={() => setSelectedPage(pages)}
      />
    </div>
  );
};

export default PaginationBar;
