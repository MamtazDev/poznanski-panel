import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import staticImg from "../../../assets/png/defaultimg.png";
import "../style.css";
import { RootState } from "../../../reducers";
import {
  apiDeleteReq,
  apiGetReq,
  apiPostReq,
  apiPutReq,
} from "../../../Constant/api-functions";
import CommonButton from "../../../Components/Buttons/CommonButton";
import PaginationBar from "../../../Components/PaginationBar";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import TipTapPage from "../../../Components/TipTapPage";

interface Content {
  subHead: string;
  img: string;
  description: string;
}

interface News {
  _id: string;
  title: string;
  intro: string;
  feature: string;
  tags: string;
  date: string;
  files?: string[];
  content: "";
  link: string;
  nickname: string;
  email: string;
  confirmed: boolean;
}

interface ArticleProps {
  tagData: any[];
}

const PropossedArticle: React.FC<ArticleProps> = ({ tagData }) => {
  const [cardData, setCardData] = useState<News[]>([]);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [preview, setPreview] = useState<string | null>(null);
  const [editData, setEditData] = useState<News | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newData, setNewData] = useState<News>({
    _id: "",
    title: "",
    intro: "",
    feature: "",
    files: [""],
    date: "",
    content: "",
    link: "",
    nickname: "",
    email: "",
    confirmed: false,
    tags: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isNewOpen,
    onOpen: onNewOpen,
    onClose: onNewClose,
  } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    apiGetReq("/news/all?type=proposed", {})
      .then((res) => {
        if (res?.news) {
          setCardData(res.news);
        } else {
          console.error("No news data found in API response", res);
        }
      })
      .catch((err) => console.error("API fetch error:", err));
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
    event: React.ChangeEvent<HTMLInputElement>,
    isNew: boolean = false
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const uploadedImageUrl = await uploadImage(file);
      if (uploadedImageUrl) {
        if (isNew) {
          setNewData((prev) => ({
            ...prev,
            files: [uploadedImageUrl],
          }));
        } else {
          setEditData((prev) =>
            prev ? { ...prev, files: [uploadedImageUrl] } : null
          );
        }
      }
    }
  };

  const handleEdit = (id: string) => {
    const selectedItem = cardData.find((item) => item._id === id);
    if (selectedItem) {
      const parsedContent = selectedItem.content; // Parse the content
      console.log("parsedContent", parsedContent)
      setEditData({ ...selectedItem, content: parsedContent }); // Set parsed content
      onOpen();
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
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
      const res = await apiDeleteReq(`/news/${id}`, {});
      if (res.success) {
        toast({ title: "Deleted successfully!", status: "success" });
        fetchArticles();
      } else {
        toast({ title: "Failed to delete", status: "error" });
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast({ title: "Error deleting item", status: "error" });
    }
  };

  const handleContentChange = (newContent: string, isNew: boolean = false) => {
    // if (isNew) {
    //   setNewData((prev) => ({
    //     ...prev,
    //     content: newContent,
    //   }));
    // } else {
    //   setEditData((prev) =>
    //     prev
    //       ? {
    //           ...prev,
    //           content: newContent,
    //         }
    //       : null
    //   );
    // }
  };

  const handleAddArticle = () => {
    setNewData({
      _id: "",
      title: "",
      intro: "",
      feature: "",
      files: [""],
      date: "",
      content: "",
      link: "",
      nickname: "",
      email: "",
      confirmed: false,
      tags: "",
    });
    onNewOpen();
  };

  const handleCreateArticle = async () => {
    try {
      const res = await apiPostReq("/news", newData);
      if (res.success) {
        fetchArticles(); // Refetch data after creation
        toast({
          title: "Article created successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onNewClose();
      } else {
        toast({
          title: "Failed to create article",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error creating article:", error);
      toast({
        title: "Error creating article",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
    isNew: boolean = false
  ) => {
    const { value } = e.target;

    if (isNew) {
      setNewData((prev) => ({ ...prev, [field]: value }));
    } else {
      setEditData((prev) => (prev ? { ...prev, [field]: value } : null));
    }
  };

  // Handle Image Selection
  const handleSave = async () => {
    if (!editData || !editData._id) return;
    const updatedData = {
      ...editData,
      content: JSON.stringify(editData.content),
    };

    try {
      const res = await apiPutReq(`/news/${editData._id}`, updatedData);
      if (res.success) {
        fetchArticles();
        toast({
          title: "Article updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: "Failed to update article",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating article:", error);
      toast({
        title: "Error updating article",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      handleImageUpload(event, true);
    }
  };

  return (
    <div className="p-3 overflow-y-auto w-full h-full pb-28">
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
        <CommonButton text="Add article" onClick={handleAddArticle} />
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
              <th className="px-6 py-3">Nick Name</th>
              <th className="px-6 py-3">Tag</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {cardData.map((item) => (
              <tr
                key={item._id}
                className={`border-b py-3 ${
                  !themeMode
                    ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "bg-white text-gray-900 hover:bg-gray-200"
                }`}
              >
                <td>
                  <img
                    src={item?.files?.[0] || staticImg}
                    className="rounded-full w-[50px] h-[50px] my-2 flex items-center mx-auto"
                  />
                </td>
                <td>{item.title}</td>
                <td>{item.nickname}</td>
                <td>{item.tags || "N/A"}</td>
                <td>{item.date}</td>
                <td>
                  <div className="flex justify-center space-x-2">
                    <button onClick={() => handleEdit(item._id)}>
                      <FaRegEdit />
                    </button>
                    <button onClick={() => handleDelete(item._id)}>
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="lg" boxShadow="xl" p={4} maxWidth={800}>
          <ModalHeader
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            color="blue.600"
          >
            Edit Article
          </ModalHeader>

          <ModalBody>
            {/* Image Upload Section */}
            <FormControl id="files" isRequired mb={4}>
              <FormLabel>Upload Image</FormLabel>
              {preview && (
                <Box
                  mt={2}
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  overflow="hidden"
                  width="150px"
                  height="150px"
                >
                  <Image
                    src={preview}
                    alt="Uploaded Preview"
                    objectFit="cover"
                  />
                </Box>
              )}

              {/* Upload Input */}
              <Input
                type="file"
                p={1}
                onChange={handleFileChange}
                accept="image/*"
              />


              {preview && (
                <Button
                  size="sm"
                  colorScheme="red"
                  mt={2}
                  onClick={() => setPreview(null)}
                >
                  Remove Image
                </Button>
              )}
            </FormControl>


            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
              <FormControl id="title" isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={editData?.title || ""}
                  onChange={(e) => handleInputChange(e, "title", false)}
                  placeholder="Enter title"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl id="nickname" isRequired>
                <FormLabel>Nickname</FormLabel>
                <Input
                  value={editData?.nickname || ""}
                  onChange={(e) => handleInputChange(e, "nickname", false)}
                  placeholder="Enter nickname"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl id="tags" isRequired>
                <FormLabel>Tags</FormLabel>
                <Input
                  value={editData?.tags || ""}
                  onChange={(e) => handleInputChange(e, "tags", false)}
                  placeholder="Enter tags"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={editData?.email || ""}
                  onChange={(e) => handleInputChange(e, "email", false)}
                  placeholder="Enter email"
                  focusBorderColor="blue.500"
                />
              </FormControl>
            </SimpleGrid>

            {/* Introduction Field */}
            <FormControl id="intro" isRequired mt={4}>
              <FormLabel>Introduction</FormLabel>
              <Textarea
                value={editData?.intro || ""}
                onChange={(e) => handleInputChange(e, "intro", false)}
                placeholder="Enter introduction"
                focusBorderColor="blue.500"
              />
            </FormControl>

            {/* Rich Text Editor */}
            <VStack spacing={4} align="stretch" mt={4}>
              {/* <TipTapPage
                content={editData?.content || ""}
                setContent={(newContent) =>
                  handleContentChange(newContent, false)
                }
              /> */}
            </VStack>

            {/* Checkbox */}
            <FormControl
              id="confirmed"
              mt={4}
              display="flex"
              alignItems="center"
            >
              <Checkbox
                colorScheme="blue"
                isChecked={editData?.confirmed || false}
                onChange={(e) =>
                  setEditData((prev) =>
                    prev ? { ...prev, confirmed: e.target.checked } : null
                  )
                }
              >
                Confirmed
              </Checkbox>
            </FormControl>
          </ModalBody>

          {/* Buttons */}
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSave} mr={3}>
              Save
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* New Article Modal */}
      <Modal isOpen={isNewOpen} onClose={onNewClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="lg" boxShadow="xl" p={4} maxWidth={800}>
          <ModalHeader
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            color="blue.600"
          >
            Create New Article
          </ModalHeader>

          <ModalBody>
            <FormControl id="files" isRequired mb={4}>
              <FormLabel>Upload Image</FormLabel>
              {preview && (
                <Box
                  mt={2}
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  overflow="hidden"
                  width="150px"
                  height="150px"
                >
                  <Image
                    src={preview}
                    alt="Uploaded Preview"
                    objectFit="cover"
                  />
                </Box>
              )}
              {/* Upload Input */}
              <Input
                type="file"
                p={1}
                onChange={handleFileChange}
                accept="image/*"
              />

              {/* Remove Image Button */}
              {preview && (
                <Button
                  size="sm"
                  colorScheme="red"
                  mt={2}
                  onClick={() => setPreview(null)}
                >
                  Remove Image
                </Button>
              )}
            </FormControl>
            {/* Grid Layout */}
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
              <FormControl id="title" isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={newData?.title || ""}
                  onChange={(e) => handleInputChange(e, "title", true)}
                  placeholder="Enter title"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl id="nickname" isRequired>
                <FormLabel>Nickname</FormLabel>
                <Input
                  value={newData?.nickname || ""}
                  onChange={(e) => handleInputChange(e, "nickname", true)}
                  placeholder="Enter nickname"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl id="tags" isRequired>
                <FormLabel>Tags</FormLabel>
                <Input
                  value={newData?.tags || ""}
                  onChange={(e) => handleInputChange(e, "tags", true)}
                  placeholder="Enter tags"
                  focusBorderColor="blue.500"
                />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={newData?.email || ""}
                  onChange={(e) => handleInputChange(e, "email", true)}
                  placeholder="Enter email"
                  focusBorderColor="blue.500"
                />
              </FormControl>
            </SimpleGrid>

            {/* Introduction Field */}
            <FormControl id="intro" isRequired mt={4}>
              <FormLabel>Introduction</FormLabel>
              <Textarea
                value={newData?.intro || ""}
                onChange={(e) => handleInputChange(e, "intro", true)}
                placeholder="Enter introduction"
                focusBorderColor="blue.500"
              />
            </FormControl>

            {/* Rich Text Editor */}
            <VStack spacing={4} align="stretch" mt={4}>
              <TipTapPage
                content={newData.content || ""}
                setContent={(newContent) =>
                  handleContentChange(newContent, true)
                }
              />
            </VStack>

            {/* Checkbox */}
            <FormControl
              id="confirmed"
              mt={4}
              display="flex"
              alignItems="center"
            >
              <Checkbox
                colorScheme="blue"
                isChecked={newData?.confirmed}
                onChange={(e) =>
                  setNewData((prev) => ({
                    ...prev,
                    confirmed: e.target.checked,
                  }))
                }
              >
                Confirmed
              </Checkbox>
            </FormControl>
          </ModalBody>

          {/* Buttons */}
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCreateArticle} mr={3}>
              Create
            </Button>
            <Button variant="outline" onClick={onNewClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PropossedArticle;
