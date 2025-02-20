import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import FolderIcon from "../../assets/png/folder_icon.png";
import { apiPostReq } from "../../Constant/api-functions";
import { fileUrl } from "../../Constant/config";
import { RootState } from "../../reducers";
import CrudBtn from "../CrudBtn";
import Input from "../TextField/Input";
import Select from "../TextField/Select";
import Textarea from "../TextField/Textarea";
import "./style.css";

interface Tag {
  _id: string;
  name: string;
}

interface Data {
  id: string;
  name: string;
  img: string;
  category: string;
  timeframe: {
    start: string;
    end: string;
  };
  link: string;
  location: string;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
  handleOk: () => void;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const MaterialsEditModal: React.FC<ModalProps> = ({
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
  const [formErrors, setFormErrors] = useState({
    title: false,
    start: false,
    end: false,
  });

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleDelete = () => {
    setData({ ...data, img: "" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeTimeframe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      timeframe: {
        ...data.timeframe,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleClickOk = () => {
    const errors = {
      title: data.name === "",
      start: data.timeframe.start === "",
      end: data.timeframe.end === "",
    };
    setFormErrors(errors);

    if (!Object.values(errors).includes(true)) {
      handleOk();
    }
  };

  const createNewTag = (value: string) => {
    apiPostReq("/tag", { name: value })
      .then((res) => {
        if (res.success) {
          setTags((prevTags) => [
            ...prevTags,
            { _id: res.result._id, name: res.result.name },
          ]);
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
                error={formErrors.title}
                errMsg="Type concert name"
                onChange={handleChange}
              />
              <Select
                label="Add Tag"
                data={tags}
                value={data.category}
                onChange={(value) => setData({ ...data, category: value })}
                handleOk={createNewTag}
              />
              <Input
                name="location"
                label="Location"
                value={data.location}
                onChange={handleChange}
              />
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
                        aria-label="Select Image"
                      >
                        + Select File
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center w-full h-full relative">
                  <img src={data.img.toString()} alt="new img" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
          <div>
            <Textarea
              label="Description"
              value={data.description}
              onChange={(value) => setData({ ...data, description: value })}
            />
          </div>
          <div>
            <Input
              name="link"
              label="YouTube Video Link"
              value={data.link}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-full justify-between gap-4">
            <div className="flex w-full">
              <Input
                name="start"
                label="Start"
                value={data.timeframe.start}
                error={formErrors.start}
                errMsg="Type start time"
                onChange={handleChangeTimeframe}
              />
            </div>
            <div className="flex w-full">
              <Input
                name="end"
                label="End"
                value={data.timeframe.end}
                error={formErrors.end}
                errMsg="Type end time"
                onChange={handleChangeTimeframe}
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
  );
};

export default MaterialsEditModal;
