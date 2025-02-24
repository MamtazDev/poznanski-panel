import {
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import RadioTv from "../../../Components/Tables/RadioTv";
import { RootState } from "../../../reducers";
import "../style.css";
import CommonButton from "../../../Components/Buttons/CommonButton";

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
  const [radioData, setRadioData] = useState<any[]>([]);
  const [newData, setNewData] = useState<any>({
    title: "",
    description: "",
    youTube: "",
    thumbnail: "",
    artists: [],
    userId: "6790c75af5c1e10f364abfd9",
    tags: "",
    date: new Date().toISOString(),
  });

  const {
    isOpen: isNewOpen,
    onOpen: onNewOpen,
    onClose: onNewClose,
  } = useDisclosure();

  const handleNewPost = () => {
    setNewData({
      title: "",
      description: "",
      youTube: "",
      thumbnail: "",
      artists: [],
      userId: "6790c75af5c1e10f364abfd9",
      tags: "",
      date: new Date().toISOString(),
    });
    onNewOpen();
  };

  return (
    <div className="p-3 overflow-y-auto w-full h-full pb-28">
      <div className="flex justify-between">
        <div
          className={`mb-4 ${themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"}`}
          style={{ width: "300px" }}
        >
          <InputGroup>
            <Input type="text" placeholder="Search..." />
            <InputRightElement>
              <AiOutlineSearch />
            </InputRightElement>
          </InputGroup>
        </div>
        <CommonButton text="Add new Item" onClick={handleNewPost} />
      </div>

      <RadioTv
        themeMode={themeMode}
        radioData={radioData}
        setRadioData={setRadioData}
        newData={newData}
        setNewData={setNewData}
        isNewOpen={isNewOpen}
        onNewOpen={onNewOpen}
        onNewClose={onNewClose}
      />
    </div>
  );
};

export default RadioTvPage;
