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
  const [themeMode, setThemeMode] = useState<boolean>(true);
  const [newData, setNewData] = useState<any>({
    timeframe: { start: "", end: "" },
    name: "",
    img: "",
    description: "",
    link: "",
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    try {
      const res = await apiDeleteReq(`/concert/${id}`, {});
      if (res.message) {
        toast({
          title: "Deleted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setRadioData((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast({
          title: "Failed to delete",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast({
        title: "Error deleting item",
        status: "error",
        duration: 3000,
        isClosable: true,
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

  const handleSave = async () => {
    if (!editData || !editData._id) return;
    const updatedData = {
      timeframe: editData.timeframe,
      name: editData.name,
      img: editData.img,
      description: editData.description,
      location: editData.location,
      link: editData.link,
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
    <div className="p-3 overflow-y-auto w-full h-full pb-28"
    style={{}}>
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
                ? "text-gray-700 bg-gray-400"
                : "bg-gray-700 text-gray-400"
            }`}>
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Link</th>
              <th className="px-6 py-3">Description</th>
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
                  className={`

                    ${themeMode
                      ? "bg-white text-gray-900"
                      : "bg-gray-800 text-gray-200"}
                  `}>
                  <td className="text-center flex items-center justify-center">
                    <img src={item.img || FolderImage} alt={item.name} className='w-20 h-20 rounded-full'/>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline">
                      View
                    </a>
                  </td>
                  <td className="text-center">{item.description}</td>
                  <td>{item.timeframe.start}</td>
                  <td>{item.timeframe.end}</td>
                  <td className="text-center space-x-2">
                    <Button onClick={() => handleEdit(item._id)}>Edit</Button>
                    <Button onClick={() => handleDelete(item._id)}>
                      Delete
                    </Button>
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

            {/* Timeframe */}
            {/* <FormControl id="timeframe" mt={4}>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="datetime-local"
                value={newData.timeframe.start}
                onChange={(e) => handleNewInputChange(e, "timeframe.start")}
              />
              <FormLabel>End Date</FormLabel>
              <Input
                type="datetime-local"
                value={newData.timeframe.end}
                onChange={(e) => handleNewInputChange(e, "timeframe.end")}
              />
            </FormControl> */}
            <FormControl id="timeframe" mt={4}>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="datetime-local"
                value={newData?.timeframe?.start || ""}
                onChange={(e) => handleNewInputChange(e, "timeframe", "start")}
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

export default ConcertContent;
