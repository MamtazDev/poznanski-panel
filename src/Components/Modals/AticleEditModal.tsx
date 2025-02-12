import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { fileUrl } from "../../Constant/config";
import Input from "../TextField/Input";
import DatePicker from "../TextField/DatePicker";
import Textarea from "../TextField/Textarea";
import Select from "../TextField/Select";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import FolderIcon from "../../assets/png/folder_icon.png";
import { apiPostReq } from "../../Constant/api-functions";
import "./style.css";
import CrudBtn from "../CrudBtn";
import TipTapPage from "../TipTapPage";

interface Tag {
  _id: string;
  name: string;
}

interface Content {
  subHead: string;
  img: string;
  description: string;
}

interface Data {
  id: string;
  title: string;
  feature: string;
  date: string;
  content: Content[];
  link: string;
}

interface News {
  _id: string;
  title: string;
  intro: string;
  feature: string;
  tags: string;
  date: string;
  content: Content[];
  link: string;
  nickname: string;
  email: string;
  confirmed: boolean;
}

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: any;
  setData: React.Dispatch<React.SetStateAction<News | null | any>>;
  handleOk: () => void;
  tags: {
    _id: string;
    name: string;
  }[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  handleImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    isNew: boolean
  ) => void;
}

const EditModal: React.FC<ModalProps> = ({
  isOpen,
  data,
  setData,
  handleOk,
  setIsOpen,
  tags,
  setTags,
  handleImageUpload,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [errTitle, setErrTitle] = useState<boolean>(false);

  const handleContentChange = (newContent: string) => {
    if (data) {
      setData({
        ...data,
        content: [
          {
            subHead: "",
            img: "",
            description: newContent,
          },
        ],
      });
      console.log("Updated content:", data.content);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!data) {
    return null;
  }

  const handleDelete = () => {
    // Handle delete action if needed
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Handle image upload logic
      };
      reader.readAsDataURL(file);
    }
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    setErrTitle(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeTag = (value: string) => {
    setData({ ...data, feature: value });
  };

  const createNewTag = (value: string) => {
    console.log(value);
    apiPostReq("/tag", { name: value })
      .then((res) => {
        if (res.success) {
          setTags((prevTags) => {
            const newTags = [...prevTags];
            newTags.push({
              _id: res.result._id,
              name: res.result.name,
            });
            return newTags;
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDescription = (value: string) => {
    // Update description field logic if needed
  };

  const handleClickOk = () => {
    if (data.title === "") {
      setErrTitle(true);
    } else {
      handleOk();
    }
  };

  const handleChangeDate = (payload: Object) => {
    console.log({ payload });
    setData({
      ...data,
      ...payload,
    });
  };

  return (
    <div>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxWidth={"100vh"}
          backgroundColor={themeMode ? "#FFF" : "#242526"}
          padding={6}>
          <ModalBody>
            <div className="flex gap-4 w-full mb-5">
              <div className="w-3/5">
                <Input
                  name="title"
                  label="Title"
                  value={data.title}
                  error={errTitle}
                  errMsg="Type news title"
                  onChange={handleTitle}
                />
                <div className="md:mt-6">
                  <Select
                    label="Add Tag"
                    data={tags}
                    value={data.feature}
                    onChange={handleChangeTag}
                    handleOk={createNewTag}
                  />
                </div>
              </div>

              <div className="image-field w-2/5">
                {data?.files?.[0] ? (
                  <img
                    src={data.files[0]}
                    alt="Uploaded Thumbnail"
                    className="rounded-md w-full h-32 object-cover"
                  />
                ) : (
                  <p>No image selected</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                <button
                  className="add-file-btn"
                  onClick={() => fileInputRef.current?.click()}>
                  + Select File
                </button>
              </div>
            </div>

            <TipTapPage
              content={data.content}
              setContent={handleContentChange}
            />

            <div className="md:mt-6">
              <DatePicker
                name="date"
                label="Date"
                value={data.date}
                onChange={handleChangeDate}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              No, cancel
            </Button>
            <Button
              variant="ghost"
              color={themeMode ? "black" : "white"}
              onClick={handleClickOk}>
              Yes, I'm sure
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditModal;
