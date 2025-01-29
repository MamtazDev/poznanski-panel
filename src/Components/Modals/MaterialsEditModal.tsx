import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { apiPostReq } from "../../Constant/api-functions";
import { RootState } from "../../reducers";
import DatePicker from "../TextField/DatePicker";
import Input from "../TextField/Input";
import Select from "../TextField/Select";
import Textarea from "../TextField/Textarea";
import "./style.css";

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
  date: string;
  title: string;
  feature?: string;
  tags: string;
  description: string;
  youTube: string;
}

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
  feature?: string;
  handleOk: () => void;
  tags: {
    _id: string;
    name: string;
  }[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}


const MaterialsEditModal: React.FC<ModalProps> = ({
  isOpen,
  data = { id: "", date: "", title: "", tags: "", description: "", youTube: "" },
  setData,
  handleOk,
  setIsOpen,
  tags,
  setTags,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const onClose = () => {
    setIsOpen(false);
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
          borderRadius="lg"
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
          transition="all 0.3s ease"
        >
          <ModalHeader
            fontSize="xl"
            fontWeight="bold"
            color={themeMode ? "#333" : "#FFF"}
            borderBottom="2px solid"
            borderColor={themeMode ? "#ddd" : "#444"}
            paddingBottom={4}
          >
            Edit Material
          </ModalHeader>
          <ModalBody>
            <div className="flex gap-4 w-full">
              <div className="w-3/5">
                <Input name="title" label="Title" errMsg="Type news title" />
                <div className="md:mt-6">
                  <Select label="Add Tag" data={tags}
                    onChange={handleChangeTag}
                    handleOk={createNewTag}
                  />
                </div>
                <div className="md:mt-6">
                  <Input name="link" label="YouTube Video Link" />
                </div>
              </div>
            </div>
            <div className="md:mt-6">
              <DatePicker
                name="date"
                label="Date"
                value={data.date}
                onChange={handleChangeDate}
              />
            </div>
            <div className="flex w-full md:mt-6">
              <Textarea label="Description" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onClose}
              _hover={{
                backgroundColor: themeMode ? "#0056b3" : "#1a73e8",
              }}
            >
              No, cancel
            </Button>
            <Button
              variant="solid"
              color={themeMode ? "white" : "white"}
              backgroundColor={themeMode ? "#6f42c1" : "#2FC4B2 "}
              _hover={{
                backgroundColor: themeMode ? "#5a2e91" : "#218838",
              }}
              onClick={handleOk}
            >
              Yes, I'm sure
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MaterialsEditModal;
