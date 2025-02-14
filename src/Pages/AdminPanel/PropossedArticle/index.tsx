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
  Text,
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
      console.log("parsedContent", parsedContent);
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
          }}>
          <p style={{ fontSize: "16px", fontWeight: "bold" }}>
            Are you sure you want to delete this item?
          </p>
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}>
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => confirmDelete(id, onClose)}>
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
          style={{ width: "300px" }}>
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
            }`}>
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
            {cardData?.length > 0 ? (
              cardData.map((item) => (
                <tr
                  key={item._id}
                  className={`border-b py-3 ${
                    !themeMode
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                      : "bg-white text-gray-900 hover:bg-gray-200"
                  }`}>
                  <td>
                    <img
                      src={item?.files?.[0] || staticImg}
                      className="rounded-full w-[50px] h-[50px] my-2 flex items-center mx-auto"
                      alt="img"
                    />
                  </td>
                  <td>
                    <p className="truncate max-w-[300px]">{item.title}</p>
                  </td>
                  <td>
                    <p className="truncate max-w-[300px]">{item.nickname}</p>
                  </td>
                  <td>
                    <p className="truncate max-w-[300px]">{item.tags}</p>
                  </td>
                  <td>
                    <p className="truncate max-w-[300px]">{item.date}</p>
                  </td>
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
              ))
            ) : (
              <tr className="relative" style={{ height: "400px" }}>
                <div className="absolute top-1/2 left-1/2 w-32 -translate-x-1/2 -translate-y-1/2">
                  <svg
                    className="svg-icon"
                    viewBox="0 0 1567 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M156.662278 699.758173h21.097186A10.444152 10.444152 0 0 1 187.994733 710.202325c0 5.765172-4.490985 10.444152-10.235269 10.444152H156.662278v21.097186A10.444152 10.444152 0 0 1 146.218126 751.978932a10.277045 10.277045 0 0 1-10.444152-10.235269V720.646477H114.676787A10.444152 10.444152 0 0 1 104.441518 710.202325c0-5.765172 4.490985-10.444152 10.235269-10.444152H135.773974v-21.097187A10.444152 10.444152 0 0 1 146.218126 668.425717c5.765172 0 10.444152 4.490985 10.444152 10.235269v21.097187z m1378.628042-83.553215v-21.097186A10.277045 10.277045 0 0 0 1524.846168 584.872503a10.444152 10.444152 0 0 0-10.444152 10.235269v21.097186h-21.097186a10.277045 10.277045 0 0 0-10.235269 10.444152c0 5.598065 4.595427 10.444152 10.235269 10.444152h21.097186v21.097187c0 5.744284 4.67898 10.235269 10.444152 10.235268a10.444152 10.444152 0 0 0 10.444152-10.235268V637.093262h21.097187c5.744284 0 10.235269-4.67898 10.235268-10.444152a10.444152 10.444152 0 0 0-10.235268-10.444152H1535.29032zM776.460024 960.861969H250.596979A20.80475 20.80475 0 0 1 229.77134 939.973665c0-11.530344 9.462402-20.888304 20.825639-20.888303h94.728457A83.010119 83.010119 0 0 1 334.212859 877.413196v-605.96969A83.49055 83.49055 0 0 1 417.849627 187.994733H480.430984V167.001988A83.49055 83.49055 0 0 1 564.067752 83.553215h501.152182A83.448773 83.448773 0 0 1 1148.856702 167.001988v605.969689c0 15.185797-4.052331 29.410732-11.133466 41.672166h115.554096c11.551232 0 20.909192 9.274407 20.909192 20.888304 0 11.530344-9.295295 20.888304-20.888304 20.888304H1002.638576v20.992745c0 15.185797-4.052331 29.410732-11.133466 41.672166h11.196131c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304h-109.893365c9.545955 16.000441 7.478013 36.972297-6.41271 50.863019a41.672166 41.672166 0 0 1-59.072122 0L776.460024 960.861969z m76.367638-41.776607h66.424806c22.977134 0 41.609501-18.59059 41.609501-41.881049V270.461756c0-22.559368-18.047494-40.690416-40.314426-40.690416H416.303892c-22.266932 0-40.314426 18.214601-40.314426 40.690416v606.742557c0 23.123352 18.799473 41.881049 41.588613 41.881049h317.084449l-10.736588-10.757477a41.693054 41.693054 0 0 1-10.861918-40.377091l-19.718558-19.739447A146.259902 146.259902 0 0 1 502.363703 627.693525a146.218126 146.218126 0 0 1 220.517822 190.981761l19.739447 19.739447a41.630389 41.630389 0 0 1 40.377091 10.841029L852.827662 919.085362zM1002.638576 814.643843h62.852906A41.797496 41.797496 0 0 0 1107.080095 772.867236V167.106429c0-23.14424-18.632367-41.776607-41.588613-41.776607H563.775316A41.797496 41.797496 0 0 0 522.207592 167.106429v20.888304h396.794216A83.448773 83.448773 0 0 1 1002.638576 271.443506V814.643843zM266.325872 46.998683h31.123572c8.773088 0 15.875111 6.955805 15.875111 15.666228 0 8.647758-7.102023 15.666228-15.875111 15.666228h-31.123572v31.123572c0 8.773088-6.955805 15.875111-15.666228 15.875111a15.770669 15.770669 0 0 1-15.666228-15.875111V78.331139H203.869844A15.728893 15.728893 0 0 1 187.994733 62.664911c0-8.647758 7.102023-15.666228 15.875111-15.666228h31.123572V15.875111c0-8.773088 6.955805-15.875111 15.666228-15.875111 8.647758 0 15.666228 7.102023 15.666228 15.875111v31.123572zM20.888304 939.973665c0-11.530344 9.462402-20.888304 20.825638-20.888303h125.455152c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304H41.713942A20.80475 20.80475 0 0 1 20.888304 939.973665z m658.733544-135.021995a104.441518 104.441518 0 1 0-147.722083-147.722083 104.441518 104.441518 0 0 0 147.722083 147.722083zM459.542681 313.324555a20.888304 20.888304 0 0 1 20.867415-20.888304H710.202325a20.888304 20.888304 0 1 1 0 41.776608H480.430984A20.825639 20.825639 0 0 1 459.542681 313.324555z m0 104.441518c0-11.530344 9.295295-20.888304 20.742085-20.888303h334.505295c11.44679 0 20.742086 9.274407 20.742086 20.888303 0 11.530344-9.295295 20.888304-20.742086 20.888304H480.284766A20.762974 20.762974 0 0 1 459.542681 417.766073z m0 104.441519c0-11.530344 9.316183-20.888304 20.846527-20.888304h146.301679c11.509455 0 20.846527 9.274407 20.846527 20.888304 0 11.530344-9.316183 20.888304-20.846527 20.888303h-146.301679A20.80475 20.80475 0 0 1 459.542681 522.207592zM62.664911 396.87777a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911zM1357.739739 271.547948a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911z"
                      fill="#8A96A3"
                    />
                  </svg>
                  <Text fontSize="lg" color="gray.500">
                    Data is not available
                  </Text>
                </div>
              </tr>
            )}
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
            color="blue.600">
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
                  height="150px">
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
                  onClick={() => setPreview(null)}>
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
              alignItems="center">
              <Checkbox
                colorScheme="blue"
                isChecked={editData?.confirmed || false}
                onChange={(e) =>
                  setEditData((prev) =>
                    prev ? { ...prev, confirmed: e.target.checked } : null
                  )
                }>
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
            color="blue.600">
            Proposed Article
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
                  height="150px">
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
                  onClick={() => setPreview(null)}>
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
              alignItems="center">
              <Checkbox
                colorScheme="blue"
                isChecked={newData?.confirmed}
                onChange={(e) =>
                  setNewData((prev) => ({
                    ...prev,
                    confirmed: e.target.checked,
                  }))
                }>
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
