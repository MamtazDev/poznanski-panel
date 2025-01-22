import React, { useEffect, useState, useRef } from "react";
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
import Textarea from "../TextField/Textarea";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import FolderIcon from "../../assets/png/folder_icon.png";
import "./style.css";
import CrudBtn from "../CrudBtn";

interface Data {
  id: string;
  name: string;
  profileImg: string;
  star: number;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    id: string;
    name: string;
    profileImg: string;
    star: number;
    description: string;
  };
  setData: React.Dispatch<React.SetStateAction<Data>>;
  handleOk: () => void;
}

const ArtistModal: React.FC<ModalProps> = ({
  isOpen,
  data,
  setData,
  handleOk,
  setIsOpen,
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
    setData({ ...data, profileImg: "" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // setEditedData({ ...editedData, profileImg: reader.result });
        setData({
          ...data,
          profileImg: reader.result ? reader.result.toString() : "",
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const onClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "name") {
      setErrTitle(false);
    }
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleDescription = (value: string) => {
    setData({ ...data, description: value });
  };

  const handleClickAdd = () => {
    if (data.name === "") {
      setErrTitle(true);
    } else {
      handleOk();
    }
  };

  return (
    <div>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxWidth={"100vh"}
          backgroundColor={themeMode ? "#E9E9EB" : "#242526"}
          padding={6}
        >
          <ModalBody>
            <div className="flex gap-2 w-full">
              <div className="w-3/5">
                <Input
                  name="name"
                  label="Name"
                  value={data.name}
                  error={errTitle}
                  errMsg="Type artist name"
                  onChange={handleChange}
                />
                <div>
                  <Textarea
                    label="Description"
                    value={data.description}
                    onChange={handleDescription}
                  />
                </div>
                <div>
                  <Input
                    name="star"
                    label="Star"
                    value={data.star}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="image-field w-2/5">
                {data?.profileImg === fileUrl || data?.profileImg === "" ? (
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
                    <img src={data.profileImg.toString()} alt="new img" />
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
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              No, cancel
            </Button>
            <Button
              variant="ghost"
              color={themeMode ? "black" : "white"}
              onClick={handleClickAdd}
            >
              Yes, I'm sure
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ArtistModal;
