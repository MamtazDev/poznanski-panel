import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  apiDeleteReq,
  apiGetReq,
  apiPostReq,
  apiPutReq,
} from "../../../Constant/api-functions";
import FolderImage from "../../../assets/png/folder_icon.png";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

// Define types for the data
interface Material {
  _id: string;
  title: string;
  description: string;
  youTube: string;
  tags: string[];
  date: string;
  commentsSection: {
    commentsIds: string[];
    embeddedComments: string[];
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface TableProps {
  // themeMode: boolean;
  cardData?: {
    id: string;
    title: string;
    description: string;
    tags: string;
    date: number;
    youTube: string;
  }[];
  handleEdit?: (id: string) => void;
  handleDelete?: (id: string) => void;
  handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedPage?: string;
  setSelectedPage?: React.Dispatch<React.SetStateAction<string>>;
  pageNum?: string;
}

const MaterialContent: React.FC<TableProps> = (props) => {
  const [radioData, setRadioData] = useState<{ materials: Material[] }>({
    materials: [],
  });
  const [editData, setEditData] = useState<Material | null>(null);
  // const [themeMode, setThemeMode] = useState<boolean>(true);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [newData, setNewData] = useState<any>({
    title: "",
    youTube: "",
    description: "",
    tags: "",
    date: "",
  });
  console.log(newData, " new data");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isNewOpen,
    onOpen: onNewOpen,
    onClose: onNewClose,
  } = useDisclosure();

  const toast = useToast();

  // Fetch data
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    apiGetReq("/materials", {}).then((res) => {
      console.log(res, "materials data");

      if (res && Array.isArray(res.materials)) {
        setMaterials(res.materials);
      } else {
        setMaterials([]);
        console.error("Invalid response format:", res);
      }
    });
  }, []);

  // Edit item
  const handleEdit = (id: string) => {
    console.log("Editing item:", id);
    const selectedItem = materials.find((item) => item._id === id);
    if (selectedItem) {
      console.log("Found item:", selectedItem);
      setEditData({ ...selectedItem });
      onOpen();
    } else {
      console.log("Item not found");
    }
  };

  const handleDelete = async (id: string) => {
    toast({
      title: "Confirm Deletion",
      description: "Are you sure you want to delete this item?",
      status: "warning",
      duration: null,
      isClosable: false,
      position: "top",
      render: ({ onClose }) => (
        <div
          style={{
            padding: "20px",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: "bold" }}>
            Are you sure you want to delete this item?
          </p>
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => confirmDelete(id, onClose)}
            >
              Yes, Delete
            </Button>
            <Button size="sm" colorScheme="blue" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      ),
    });
  };

  const confirmDelete = async (id: string, onClose: () => void) => {
    onClose();  // Close the confirmation toast

    try {
      const res = await apiDeleteReq(`/materials/${id}`, {});
      if (res.message) {
        toast({
          title: "Deleted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setRadioData((prev) => ({
          materials: prev.materials.filter((item) => item._id !== id),
        }));
      } else {
        toast({
          title: "Failed to delete",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast({
        title: "Error deleting item",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };


  const handleSave = async () => {
    if (!editData || !editData._id) return;
    const updatedData = {
      title: editData.title,
      description: editData.description,
      youTube: editData.youTube,
      tags: editData.tags,
      date: editData.date,
    };

    try {
      const res = await apiPutReq(`/materials/${editData._id}`, updatedData);
      if (res) {
        setRadioData((prev) => ({
          materials: prev.materials.map((item) =>
            item._id === editData._id ? { ...item, ...res.data } : item,
          ),
        }));

        toast({
          title: "Material updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setEditData(null);
        onClose();
      } else {
        toast({
          title: "Failed to update material",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating material:", error);

      toast({
        title: "Error updating material",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNewPost = () => {
    setNewData({
      title: "",
      description: "",
      youTube: "",
      tags: [], // Should be an array
      date: "",
    });
    onNewOpen();
  };

  const handleCreatePost = async () => {
    try {
      console.log("Sending Data:", newData);
      const res = await apiPostReq("/materials", newData);
      console.log("API Response:", res);

      if (res.success) {
        setRadioData((prev) => ({
          materials: [...prev.materials, res.data],
        }));
        toast({
          title: "Post created successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onNewClose();
      } else {
        toast({
          title: "Failed to create post",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error creating new material:", error);
      toast({
        title: "Server error while creating post",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNewInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    field: string,
  ) => {
    setNewData((prev: any) => ({
      ...prev,
      [field]: field === "tags" ? e.target.value.split(",") : e.target.value,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: string,
    subField?: string,
  ) => {
    const { value } = e.target;
    setEditData((prev: any) => {
      if (!prev) return prev;
      if (subField) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [subField]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  return (
    <div className="p-3 overflow-y-auto w-full h-full pb-28">
      <div className="flex items-center justify-end py-5">
        <Button colorScheme="green" onClick={handleNewPost}>
          Add New Item
        </Button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full h-full" style={{ minWidth: "400px" }}>
          <thead
            className={`text-xs uppercase ${
              themeMode
              ? "text-white bg-[#5A1073]"
              : "bg-[#3bd6c6] text-[#5A1073]"
            }`}
          >
            <tr>
              <th className="px-6 py-3" style={{ width: "130px" }}>
                Video
              </th>
              <th className="px-6 py-3" style={{ width: "130px" }}>
                Title
              </th>
              <th className="px-6 py-3" style={{ width: "130px" }}>
                Tags
              </th>
              <th className="px-6 py-3" style={{ width: "130px" }}>
                Date
              </th>
              <th className="px-6 py-3" style={{ width: "130px" }}>
                Description
              </th>
              <th className="px-6 py-3" style={{ width: "130px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {materials.length > 0 ? (
              materials.map((item: Material, index: number) => (
                <tr
                  key={index}
                  className={`border-b py-4  ${
                    !themeMode
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                      : "bg-white text-gray-900 hover:bg-gray-200"
                  }`}
                >
                   <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <iframe
                      src={
                        item?.youTube?.includes("youtube.com/watch")
                          ? `https://www.youtube.com/embed/${
                              item?.youTube?.split("v=")[1].split("&")[0]
                            }`
                          : item?.youTube ||
                            "https://www.youtube.com/embed/6JYIGclVQdw"
                      }
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      frameBorder="0"
                      className="w-40 h-24 md: rounded-lg shadow-lg"
                    ></iframe>
                  </div>
                </td>
                  <td className="py-4">{item.title}</td>
                  <td className="py-4">{item.tags}</td>
                  <td className="py-4">{new Date(item.date).toISOString().split('T')[0]}</td>
                  <td className="py-4">{item.description}</td>
                  <td className="text-center py-4">
                    <div className="flex justify-center space-x-2">
                      <button onClick={() => handleEdit(item._id)}><FaRegEdit /></button>
                      <button onClick={() => handleDelete(item._id)}>
                      <RiDeleteBin6Line />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Item</ModalHeader>
          <ModalBody>
            {/* Title */}
            <FormControl id="title" isRequired mt={4}>
              <FormLabel>Title</FormLabel>
              <Input
                value={editData?.title}
                onChange={(e) => handleInputChange(e, "title")}
                placeholder="Enter title"
              />
            </FormControl>
          </ModalBody>
          <ModalBody>
            {/* Title */}
            <FormControl id="youTube" isRequired mt={4}>
              <FormLabel>Link</FormLabel>
              <Input
                value={editData?.youTube}
                onChange={(e) => handleInputChange(e, "youTube")}
                placeholder="Enter YouTube Link"
              />
            </FormControl>
          </ModalBody>
          <ModalBody>
            {/* description */}
            <FormControl id="description" isRequired mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                value={editData?.description}
                onChange={(e) => handleInputChange(e, "description")}
                placeholder="Enter description"
              />
            </FormControl>

            <FormControl id="tags" isRequired mt={4}>
              <FormLabel>Tags</FormLabel>
              <Input
                value={editData?.tags}
                onChange={(e) => handleInputChange(e, "tags")}
                placeholder="Enter tags"
              />
            </FormControl>
            <FormControl id="date" isRequired mt={4}>
              <FormLabel>Date</FormLabel>
              <Input
                value={editData?.date}
                onChange={(e) => handleInputChange(e, "date")}
                placeholder="Enter date"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* New Post Modal */}
      <Modal isOpen={isNewOpen} onClose={onNewClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Item</ModalHeader>
          <ModalBody>
            {/* Title */}
            <FormControl id="title" isRequired mt={4}>
              <FormLabel>Title</FormLabel>
              <Input
                value={newData.title}
                onChange={(e) => handleNewInputChange(e, "title")}
                placeholder="Enter title"
              />
            </FormControl>
            <FormControl id="tags" isRequired mt={4}>
              <FormLabel>tags</FormLabel>
              <Input
                value={newData.tags}
                onChange={(e) => handleNewInputChange(e, "tags")}
                placeholder="Enter tags"
              />
            </FormControl>

            {/* Description */}
            <FormControl id="description" isRequired mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={newData.description}
                onChange={(e) => handleNewInputChange(e, "description")}
                placeholder="Enter description"
              />
            </FormControl>

            {/* Link */}
            <FormControl id="youTube" mt={4}>
              <FormLabel>Link</FormLabel>
              <Input
                value={newData.youTube}
                onChange={(e) => handleNewInputChange(e, "youTube")}
                placeholder="Enter link"
              />
            </FormControl>

            <FormControl id="date" mt={4}>
              <FormLabel>Start Date</FormLabel>
              <Input
                value={editData?.date}
                onChange={(e) => handleInputChange(e, "date")}
                placeholder="Enter date"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCreatePost}>
              Create
            </Button>
            <Button variant="ghost" onClick={onNewClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MaterialContent;
