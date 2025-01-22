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
  description: string;
  img1: string;
  img2: string;
}

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    id: string;
    name: string;
    description: string;
    img1: string;
    img2: string;
  };
  setData: React.Dispatch<React.SetStateAction<Data>>;
  handleOk: () => void;
}

interface Err {
  errTitle: boolean;
  errImg1: boolean;
  errImg2: boolean;
}

const LogoModal: React.FC<ModalProps> = ({
  isOpen,
  data,
  setData,
  handleOk,
  setIsOpen,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const fileInputRef1 = React.useRef<HTMLInputElement>(null);
  const fileInputRef2 = React.useRef<HTMLInputElement>(null);
  const [err, setErr] = useState<Err>({
    errTitle: false,
    errImg1: false,
    errImg2: false,
  });

  const handleButtonClick = (value: boolean) => {
    if (value) {
      if (fileInputRef1.current) {
        fileInputRef1.current.click(); // Trigger the file selection dialog
      }
    } else {
      if (fileInputRef2.current) {
        fileInputRef2.current.click(); // Trigger the file selection dialog
      }
    }
  };

  const handleDelete = (value: string, mode?: boolean) => {
    if (mode) {
      setData({ ...data, img1: "" });
    } else {
      setData({ ...data, img2: "" });
    }
  };

  const handleImageChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErr({ ...err, errImg1: false });
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // setEditedData({ ...editedData, img: reader.result });
        setData({
          ...data,
          img1: reader.result ? reader.result.toString() : "",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErr({ ...err, errImg2: false });
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // setEditedData({ ...editedData, img: reader.result });
        setData({
          ...data,
          img2: reader.result ? reader.result.toString() : "",
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
      setErr({ ...err, errTitle: false });
    }
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickAdd = () => {
    if (data.name === "") {
      setErr({ ...err, errTitle: true });
    } else if (data.img1 === "") {
      setErr({ ...err, errImg1: true });
    } else if (data.img2 === "") {
      setErr({ ...err, errImg2: true });
    } else {
      handleOk();
    }
  };

  const handleDescription = (value: string) => {
    setData({ ...data, description: value });
  };

  return (
    <div>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxWidth={"600px"}
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
                  error={err.errTitle}
                  errMsg="Type Logo Name"
                  onChange={handleChange}
                />
                <div>
                  <Textarea
                    label="Description"
                    value={data.description}
                    onChange={handleDescription}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-2/5">
                <div
                  className={`image-field w-full h-44 ${err.errImg1 ? "border border-red-500 text-red-900 placeholder-red-700 bg-red-900" : "border"}`}
                >
                  {data?.img1 === fileUrl || data?.img1 === "" ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-center bg-gray-400">
                          <img
                            src={FolderIcon}
                            className="bg-grey-400"
                            alt="no data"
                          />
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange1}
                            ref={fileInputRef1}
                            style={{ display: "none" }}
                          />
                          <button
                            className="add-file-btn"
                            onClick={() => handleButtonClick(true)}
                          >
                            + Select File
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center w-full h-full relative">
                      <img src={data.img1.toString()} alt="new img" />
                      <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 `}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange1}
                          ref={fileInputRef1}
                          style={{ display: "none" }}
                        />
                        <div
                          className={`rounded-lg opacity-70 ${themeMode ? "bg-gray-400" : "bg-gray-50"}`}
                        >
                          <CrudBtn
                            value=""
                            mode={true}
                            onClickDelete={handleDelete}
                            onClickEdit={() => handleButtonClick(true)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className={`image-field w-full h-44 ${err.errImg2 ? "border border-red-500 text-red-900 placeholder-red-700" : "border-dashed"}`}
                >
                  {data?.img2 === fileUrl || data?.img2 === "" ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-center">
                          <img src={FolderIcon} alt="no data" />
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange2}
                            ref={fileInputRef2}
                            style={{ display: "none" }}
                          />
                          <button
                            className="add-file-btn"
                            onClick={() => handleButtonClick(false)}
                          >
                            + Select File
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center w-full h-full relative">
                      <img src={data.img2.toString()} alt="new img" />
                      <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 `}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange2}
                          ref={fileInputRef2}
                          style={{ display: "none" }}
                        />
                        <div
                          className={`rounded-lg opacity-70 ${themeMode ? "bg-gray-400" : "bg-gray-50"}`}
                        >
                          <CrudBtn
                            value=""
                            mode={false}
                            onClickDelete={handleDelete}
                            onClickEdit={() => handleButtonClick(false)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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

export default LogoModal;
