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

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
  handleOk: () => void;
  tags: {
    _id: string;
    name: string;
  }[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const EditModal: React.FC<ModalProps> = ({
  isOpen,
  data,
  setData,
  handleOk,
  setIsOpen,
  tags,
  setTags,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [errTitle, setErrTitle] = useState<boolean>(false);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file selection dialog
    }
  };
  if (!data) {
    // Return null if data is undefined to prevent rendering issues
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
      ...data, ...payload,
    });
  };

  return (
    <div>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxWidth={"100vh"}
          backgroundColor={themeMode ? "#FFF" : "#242526"}
          padding={6}
        >
          <ModalBody>
            <div className="flex gap-4 w-full">
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
                <div className="md:mt-6">
                  <Input
                    name="link"
                    label="YouTube Video Link"
                    value={data.link}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="image-field w-2/5">
                {data?.content[0].img === fileUrl || data?.content[0].img === "" ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-center">
                        <img src={FolderIcon} alt="no data" />
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                          style={{ display: "none" }}
                        />
                        <button
                          className="add-file-btn"
                          onClick={handleButtonClick}
                        >
                          + Select File
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center w-full h-full relative">
                    <img src={data.content[0].img.toString()} alt="new img" />
                    <div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 `}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                      />
                      <div
                        className={`rounded-lg opacity-70 ${themeMode ? "bg-gray-400" : "bg-gray-50"}`}
                      >
                        <CrudBtn
                          value=""
                          onClickDelete={handleDelete}
                          onClickEdit={handleButtonClick}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {data.content.map((item, idx) => (
              <div key={`article-edit-modal-${idx}`}>
                <div className="md:mt-6">
                  <Input
                    name="subTitle"
                    label={`Sub Title ${idx + 1}`}
                    value={item.subHead}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex w-full md:mt-6">
                  <Textarea
                    label="Description"
                    value={item.description}
                    onChange={handleDescription}
                  />
                </div>
              </div>
            ))}
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
              onClick={handleClickOk}
            >
              Yes, I'm sure
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditModal;
