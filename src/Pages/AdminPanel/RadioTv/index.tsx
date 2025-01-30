import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import RadioTv from "../../../Components/Tables/RadioTv";
import { RootState } from "../../../reducers";
import "../style.css";

interface Product {
  id: string;
  title: string;
  img: string;
  category: string;
  date: string;
  link: string;
  location: string;
  artist: string;
  star: number;
}

interface inputProducts {
  _id: string;
  title: string;
  img: string;
  category: string;
  date: string | Date;
  link: string;
  location: string;
  artist: string;
  star: number;
}

interface Tag {
  _id: string;
  name: string;
}

interface ProductContentProps {
  path: string;
  tagData: {
    _id: string;
    name: string;
  }[];
}

const RadioTvPage: React.FC<ProductContentProps> = ({ path, tagData }) => {
 const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  return (
    <div className="p-3 overflow-y-auto w-full h-full pb-28">

      <div className="flex justify-between">
        <div className="mb-4" style={{ width: "300px" }}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Search..."
              backgroundColor="white"
              // onChange={handleChangeFilterText}
            />
            <InputRightElement pointerEvents="none">
              <AiOutlineSearch />
            </InputRightElement>
          </InputGroup>
        </div>
            {/* <button>Add New Items</button> */}
      </div>

      <RadioTv themeMode={themeMode} />

    </div>
  );
};

export default RadioTvPage;
