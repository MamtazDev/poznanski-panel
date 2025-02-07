import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import FolderIcon from "../../assets/png/folder_icon.png";
import { apiPostReq } from "../../Constant/api-functions";
import { fileUrl } from "../../Constant/config";
import { RootState } from "../../reducers";
import CrudBtn from "../CrudBtn";
import Input from "../TextField/Input";
import Select from "../TextField/Select";
import "./style.css";

interface Tag {
  _id: string;
  name: string;
}

interface Data {
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

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    id: string;
    title: string;
    img: string;
    category: string;
    date: string;
    link: string;
    location: string;
    artist: string;
    star: number;
  };
  setData: React.Dispatch<React.SetStateAction<Data>>;
  handleOk?: () => void;
  tags: {
    _id: string;
    name: string;
  }[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const ProductEditModal: React.FC<ModalProps> = ({
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

  const handleDelete = () => {
    setData({ ...data, img: "" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // setEditedData({ ...editedData, img: reader.result });
        setData({
          ...data,
          img: reader.result ? reader.result.toString() : "",
        });
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
    setData({ ...data, category: value });
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
        throw err;
      });
  };

  const handleClickOk = () => {
    if (data.title === "") {
      setErrTitle(true);
    } else {
      // handleOk();
    }
  };

  return (
    <>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxWidth={"100vh"}
          backgroundColor={themeMode ? "#E9E9EB" : "#242526"}
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
                  errMsg="Type new title "
                  onChange={handleTitle}
                />
                <div className="md:mt-6">
                  <Select
                    label="Add Tag"
                    data={tags}
                    value={data.category}
                    onChange={handleChangeTag}
                    // handleOk={createNewTag}
                  />
                </div>
                <div className="md:mt-6">
                  <Input
                    name="location"
                    label="Location"
                    value={data.location}
                    onChange={handleChange}
                  />
                </div>
                {/* <Textarea
                  label="Description"
                  value={data.description}
                  onChange={handleDescription}
                /> */}
              </div>
              <div className="image-field w-2/5">
                {data?.img === fileUrl || data?.img === "" ? (
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
                    <img src={data.img.toString()} alt="new img" />
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
            <div className="md:mt-6">
              <Input
                name="link"
                label="YouTube Video Link"
                value={data.link}
                onChange={handleChange}
              />
            </div>
            <div className="flex w-full justify-between gap-4 md:mt-6">
              <div className="flex w-4/5">
                <Input
                  name="artist"
                  label="Artist"
                  value={data.artist}
                  onChange={handleChange}
                />
              </div>
              <div className="flex w-1/5">
                <Input
                  name="star"
                  label="Rate"
                  value={data.star}
                  onChange={handleChange}
                />
              </div>
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
    </>
  );
};

export default ProductEditModal;
