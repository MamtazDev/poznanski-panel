import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import DatePicker from "../TextField/DatePicker";
import Input from "../TextField/Input";
import Select from "../TextField/Select";
import "./style.css";

interface Tag {
  _id: string;
  name: string;
}

interface Data {
  date: string;
  title: string;
  feature?: string;
  tags: string;
  description: string;
  youTube: string;
  comment?: string;
}

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
  feature?: string;
  handleOk: () => void;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const MaterialsAddModal: React.FC<ModalProps> = ({
  isOpen,
  data = {
    date: "",
    title: "",
    tags: "",
    description: "",
    youTube: "",
    comment: "",
  },
  setData,
  handleOk,
  setIsOpen,
  tags,
  setTags,
}) => {
  const [materials, setMaterials] = useState<Data[]>([]);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!data.date) {
      setData((prevData) => ({
        ...prevData,
        date: new Date().toISOString().split("T")[0], // Default to today's date if no date is set
      }));
    }

    if (!data.tags && tags.length > 0) {
      setData((prevData) => ({
        ...prevData,
        tags: tags[0].name, // Default to first tag in the list
      }));
    }
  }, [tags, data, setData]);

  const handleChangeTag = (value: string) => {
    if (value) {
      setData((prevData) => ({
        ...prevData,
        tags: value,
      }));
    }
  };

  const createNewTag = (value: string) => {
    console.log(value);
    setTags((prevTags) => [...prevTags, { _id: `${Date.now()}`, name: value }]);
  };

  const handleChangeDate = (value: any) => {
    // Validate if value is a valid date
    const selectedDate =
      value instanceof Date && !isNaN(value.getTime()) ? value : null;

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // "yyyy-MM-dd"
      setData((prevData) => ({
        ...prevData,
        date: formattedDate, // Set the custom date (could be any date, including past or future dates)
      }));
    } else {
      // If no date selected, set it to today's date or handle the error as needed
      setData((prevData) => ({
        ...prevData,
        date: new Date().toISOString().split("T")[0], // Default to today's date
      }));
    }
  };

  const handleSaveMaterial = () => {
    console.log("Current Material Data: ", data);
    setMaterials((prevMaterials) => [...prevMaterials, { ...data }]);
    setIsOpen(false);
  };

  const handleChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      comment: e.target.value,
    });
  };

  return (
    <div>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxWidth="100vh"
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
                <Input
                  name="title"
                  label="Title"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  errMsg="Type news title"
                />
                <div className="md:mt-6">
                  <Select
                    label="Add Tag"
                    data={tags}
                    value={data.tags || (tags.length > 0 ? tags[0].name : "")}
                    onChange={handleChangeTag}
                    handleOk={createNewTag}
                  />
                </div>
                <div className="md:mt-6">
                  <Input
                    name="link"
                    label="YouTube Video Link"
                    value={data.youTube}
                    onChange={(e) =>
                      setData({ ...data, youTube: e.target.value })
                    }
                  />
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
            <div className="space-y-3 w-full md:mt-6">
              <label
                className="text-lg font-bold"
                style={{ color: themeMode ? "#333" : "#FFF" }}
              >
                Description
              </label>
              <textarea
                style={{ color: themeMode ? "#333" : "#FFF" }}
                className="w-full bg-transparent border rounded-lg h-10 pl-3"
                defaultValue={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
            </div>
            <div className="md:mt-6">
              <Input
                name="comment"
                label="Comment"
                value={data.comment}
                onChange={handleChangeComment}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onClose}
              _hover={{ backgroundColor: themeMode ? "#0056b3" : "#1a73e8" }}
            >
              No, cancel
            </Button>
            <Button
              variant="solid"
              color="white"
              backgroundColor={themeMode ? "#6f42c1" : "#2FC4B2"}
              _hover={{ backgroundColor: themeMode ? "#5a2e91" : "#218838" }}
              onClick={handleSaveMaterial}
            >
              Yes, I'm sure
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MaterialsAddModal;
