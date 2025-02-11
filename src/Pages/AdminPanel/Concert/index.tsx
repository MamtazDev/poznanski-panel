import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
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
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineArrowOutward } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import CommonButton from "../../../Components/Buttons/CommonButton";
import img from "../../../assets/png/profileImg3.png";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";

interface TableProps {
  themeMode?: boolean;
  cardData?: {
    id: string;
    title: string;
    img: string;
    category: string;
    date: string;
    link: string;
    location: string;
    artist: string;
    star: number;
    isFeatured: boolean;
  }[];
  handleEdit?: (id: string) => void;
  handleDelete?: (id: string) => void;
  handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedPage?: string;
  setSelectedPage?: React.Dispatch<React.SetStateAction<string>>;
  pageNum?: string;
}

const ConcertContent: React.FC<TableProps> = (props) => {
  const [radioData, setRadioData] = useState<any[]>([]);
  const [editData, setEditData] = useState<any | null>(null);
  // const [themeMode, setThemeMode] = useState<boolean>(true);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [newData, setNewData] = useState<any>({
    timeframe: { start: "", end: "" },
    name: "",
    img: "",
    description: "",
    link: "",
    isFeatured: false,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isNewOpen,
    onOpen: onNewOpen,
    onClose: onNewClose,
  } = useDisclosure();
  const toast = useToast();

  // Fetch data
  useEffect(() => {
    apiGetReq("/concert", {}).then((res) => {
      setRadioData(res.products);
    });
  }, []);

  // Edit item
  const handleEdit = (id: string) => {
    const selectedItem = radioData.find((item) => item._id === id);
    if (selectedItem) {
      setEditData({ ...selectedItem });
      onOpen();
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
    onClose(); // Close the confirmation toast

    try {
      const res = await apiDeleteReq(`/concert/${id}`, {});
      if (res.message) {
        toast({
          title: "Deleted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setRadioData((prev) => prev.filter((item) => item._id !== id));
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: string,
    subField?: string
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

  const handleNewInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: string,
    subField?: string
  ) => {
    const { value } = e.target;

    setNewData((prev: any) => {
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

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await apiPostReq("/upload", formData, true);
      return res?.fileUrl || "";
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const uploadedImageUrl = await uploadImage(file);
      if (uploadedImageUrl) {
        setEditData((prevData: any) => ({
          ...prevData,
          img: uploadedImageUrl,
        }));
      }
    }
  };

  const handleNewImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const uploadedImageUrl = await uploadImage(file);
      if (uploadedImageUrl) {
        setNewData((prevData: any) => ({
          ...prevData,
          img: uploadedImageUrl,
        }));
      }
    }
  };

  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData((prev: any) => ({
      ...prev,
      isFeatured: e.target.value === "true",
    }));
  };

  const handleNewFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewData((prev: any) => ({
      ...prev,
      isFeatured: e.target.value === "true",
    }));
  };

  const handleSave = async () => {
    if (!editData || !editData._id) return;
    const updatedData = {
      timeframe: editData.timeframe,
      name: editData.name,
      img: editData.img,
      description: editData.description,
      location: editData.location,
      link: editData.link,
      isFeatured: editData.isFeatured,
    };

    try {
      const res = await apiPutReq(`/concert/${editData._id}`, updatedData);
      if (res) {
        setRadioData((prev) =>
          prev.map((item) =>
            item._id === editData._id ? { ...item, ...res.data } : item
          )
        );

        toast({
          title: "Concert updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setEditData(null);
        onClose();
      } else {
        toast({
          title: "Failed to update concert",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating concert:", error);

      toast({
        title: "Error updating concert",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNewPost = () => {
    setNewData({
      timeframe: { start: "", end: "" },
      name: "",
      img: "",
      description: "",
      link: "",
    });
    onNewOpen();
  };

  const handleCreatePost = async () => {
    try {
      const res = await apiPostReq("/concert", newData);
      if (res.success) {
        setRadioData((prev) => [...prev, res.data]);
        onNewClose();
      }
    } catch (error) {
      console.error("Error creating new concert item:", error);
    }
  };

  return (
    <div className="p-3 overflow-y-auto w-full h-full pb-28" style={{}}>
      {/* <div className="flex items-center justify-end py-5">
        <Button colorScheme="green" onClick={handleNewPost}>
          Add New Item
        </Button>
      </div> */}
      <div className="flex justify-between">
        <div
          className={`mb-4 ${
            themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
          }`}
          style={{ width: "300px" }}
        >
          <InputGroup>
            <Input type="text" placeholder="Search..." />
            <InputRightElement>
              <AiOutlineSearch />
            </InputRightElement>
          </InputGroup>
        </div>
        <CommonButton text="Add New Item" onClick={handleNewPost} />
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
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Link</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">isFeatured</th>
              <th className="px-6 py-3">Start</th>
              <th className="px-6 py-3">End</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {radioData.length ? (
              radioData.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b py-4  ${
                    !themeMode
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                      : "bg-white text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  <td>
                    <img
                      src={item.img || img}
                      alt={item.name}
                      className="rounded-full w-[50px] h-[50px] my-2 flex items-center mx-auto"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td>
                    <button
                      className={` py-2 px-4 rounded-md ${themeMode ? "bg-gray-100" : "bg-gray-900"}`}
                    >
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 font-semibold flex items-center gap-2 justify-center"
                      >
                        Preview
                        <MdOutlineArrowOutward />
                      </a>
                    </button>
                  </td>
                  <td className="text-center">{item.description}</td>
                  <td className="text-center">
                    {item.isFeatured === true ? "Featured" : "Not Featured"}
                  </td>
                  <td>
                    {new Date(item.timeframe.start).toISOString().split("T")[0]}
                  </td>
                  <td>
                    {new Date(item.timeframe.end).toISOString().split("T")[0]}
                  </td>
                  <td className="text-center space-x-2">
                    <button onClick={() => handleEdit(item._id)}>
                      <FaRegEdit />
                    </button>
                    <button onClick={() => handleDelete(item._id)}>
                      <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-500">
                  No concerts available
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
          <div
            className={` ${
              themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
            }`}
          >
            <ModalHeader>Edit Item</ModalHeader>
            <ModalBody>
              {/* Title */}
              <FormControl id="title" isRequired mt={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  value={editData?.name}
                  onChange={(e) => handleInputChange(e, "name")}
                  placeholder="Enter title"
                />
              </FormControl>

              {/* Description */}
              <FormControl id="description" isRequired mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={editData?.description}
                  onChange={(e) => handleInputChange(e, "description")}
                  placeholder="Enter description"
                />
              </FormControl>

              {/* Link */}
              <FormControl id="link" mt={4}>
                <FormLabel>Link</FormLabel>
                <Input
                  value={editData?.link}
                  onChange={(e) => handleInputChange(e, "link")}
                  placeholder="Enter link"
                />
              </FormControl>

              {/* Location */}
              <FormControl id="location" mt={4}>
                <FormLabel>Location</FormLabel>
                <Input
                  value={editData?.location}
                  onChange={(e) => handleInputChange(e, "location")}
                  placeholder="Enter location"
                />
              </FormControl>

              {/* Timeframe */}
              <FormControl id="timeframe" mt={4}>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="datetime-local"
                  value={editData?.timeframe?.start || ""}
                  onChange={(e) => handleInputChange(e, "timeframe", "start")}
                />

                <FormLabel>End Date</FormLabel>
                <Input
                  type="datetime-local"
                  value={editData?.timeframe?.end || ""}
                  onChange={(e) => handleInputChange(e, "timeframe", "end")}
                />
              </FormControl>

              {/* Thumbnail */}
              <FormControl id="thumbnail" mt={4}>
                <FormLabel>Thumbnail</FormLabel>
                <img
                  width={200}
                  height={200}
                  src={editData?.img || FolderImage}
                  alt="Thumbnail"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  mt={2}
                />
              </FormControl>

              {/* isFeatured */}
              <FormControl id="isFeatured" mt={4}>
                <FormLabel>Featured Status</FormLabel>
                <label>
                  <input
                    type="radio"
                    name="editIsFeatured"
                    value="true"
                    checked={editData?.isFeatured === true}
                    onChange={handleFeaturedChange}
                  />
                  Featured
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="editIsFeatured"
                    value="false"
                    checked={editData?.isFeatured === false}
                    onChange={handleFeaturedChange}
                  />
                  Not Featured
                </label>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={handleSave} className="mr-3">
                Save
              </Button>
              <Button variant="red" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>

      {/* New Post Modal */}
      <Modal isOpen={isNewOpen} onClose={onNewClose}>
        <ModalOverlay />
        <ModalContent>
          <div
            className={` ${
              themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
            }`}
          >
            <ModalHeader>Add New Item</ModalHeader>
            <ModalBody>
              {/* Title */}
              <FormControl id="title" isRequired mt={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  value={newData.name}
                  onChange={(e) => handleNewInputChange(e, "name")}
                  placeholder="Enter title"
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
              <FormControl id="link" mt={4}>
                <FormLabel>Link</FormLabel>
                <Input
                  value={newData.link}
                  onChange={(e) => handleNewInputChange(e, "link")}
                  placeholder="Enter link"
                />
              </FormControl>

              {/* Location */}
              <FormControl id="location" mt={4}>
                <FormLabel>Location</FormLabel>
                <Input
                  value={newData.location}
                  onChange={(e) => handleNewInputChange(e, "location")}
                  placeholder="Enter location"
                />
              </FormControl>

              {/* Time frame */}
              <FormControl id="timeframe" mt={4}>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="datetime-local"
                  value={newData?.timeframe?.start || ""}
                  onChange={(e) =>
                    handleNewInputChange(e, "timeframe", "start")
                  }
                />

                <FormLabel>End Date</FormLabel>
                <Input
                  type="datetime-local"
                  value={newData?.timeframe?.end || ""}
                  onChange={(e) => handleNewInputChange(e, "timeframe", "end")}
                />
              </FormControl>

              {/* Thumbnail */}
              <FormControl id="thumbnail" mt={4}>
                <FormLabel>Thumbnail</FormLabel>
                <img
                  width={200}
                  height={200}
                  src={newData.img || FolderImage}
                  alt="Thumbnail"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleNewImageUpload}
                  mt={2}
                />
              </FormControl>

              {/* Is Featured */}
              <FormControl id="isFeatured" mt={4}>
                <FormLabel>Featured Status</FormLabel>
                <label>
                  <input
                    type="radio"
                    name="newIsFeatured"
                    value="true"
                    checked={newData.isFeatured === true}
                    onChange={handleNewFeaturedChange}
                  />
                  Featured
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="newIsFeatured"
                    value="false"
                    checked={newData.isFeatured === false}
                    onChange={handleNewFeaturedChange}
                  />
                  Not Featured
                </label>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                onClick={handleCreatePost}
                className="mr-3"
              >
                Create
              </Button>
              <Button variant="red" onClick={onNewClose}>
                Cancel
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ConcertContent;
