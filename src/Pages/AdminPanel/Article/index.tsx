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
  Textarea,
  useDisclosure,
  useToast,
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
import TipTapPage from "../../../Components/TipTapPage";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

interface Comment {
  author: string;
  text: string;
  date: string;
}

interface CommentsSection {
  comments: Comment[];
}

interface News {
  _id: string;
  title: string;
  intro: string;
  feature: string;
  tags: string;
  date: string;
  files?: string[];
  content: Content[];
  link: string;
  nickname: string;
  email: string;
  confirmed: boolean;
  confirmationToken: string;
  commentsSection: CommentsSection;
}

interface Content {
  subHead: string;
  img: string;
  description: string;
}

interface ArticleProps {
  tagData: any[];
}

const Article: React.FC<ArticleProps> = ({ tagData }) => {
  const [cardData, setCardData] = useState<News[]>([]);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [editData, setEditData] = useState<News | null>(null);
  const [newData, setNewData] = useState<News>({
    _id: "",
    title: "",
    intro: "",
    feature: "",
    files: [""],
    date: "",
    content: [{ subHead: "", img: "", description: "" }],
    link: "",
    nickname: "",
    email: "",
    confirmed: false,
    confirmationToken: "",
    commentsSection: { comments: [] },
    tags: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isNewOpen,
    onOpen: onNewOpen,
    onClose: onNewClose,
  } = useDisclosure();
  const toast = useToast();

  const fetchArticles = () => {
    apiGetReq("/news/all", {})
      .then((res) => {
        if (res?.news) {
          setCardData(res.news);
        } else {
          console.error("No news data found in API response", res);
        }
      })
      .catch((err) => console.error("API fetch error:", err));
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await apiPostReq("/upload", formData, true);
      return res?.fileUrl || ""; // Make sure this matches API response
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
            files: [uploadedImageUrl], // Store the uploaded file in `files`
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
      setEditData({ ...selectedItem });
      onOpen();
    }
  };

  const handleDelete = async (id: string) => {
    // Show confirmation toast
    toast({
      position: "top",
      duration: null, // Wait until user action
      isClosable: false,
      render: ({ onClose }) => (
        <div
          style={{
            background: "white",
            padding: "20px",
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
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Button
              colorScheme="red"
              size="sm"
              onClick={async () => {
                onClose(); // Close confirmation toast
                await deleteItem(id);
              }}
            >
              Yes, Delete
            </Button>
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      ),
    });
  };

  const deleteItem = async (id: string) => {
    try {
      const res = await apiDeleteReq(`/news/${id}`, {});
      if (res.success) {
        toast({
          title: "Deleted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        fetchArticles();
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

    try {
      const res = await apiPutReq(`/news/${editData._id}`, editData);
      if (res.success) {
        fetchArticles(); // Refetch data after update
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

  const handleAddArticle = () => {
    setNewData({
      _id: "",
      title: "",
      intro: "",
      feature: "",
      files: [""],
      date: "",
      content: [{ subHead: "", img: "", description: "" }],
      link: "",
      nickname: "",
      email: "",
      confirmed: false,
      confirmationToken: "",
      commentsSection: { comments: [] },
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

      {/* <TipTapPage/> */}

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
                <td>{item.tags}</td>
                <td>{new Date(item.date).toISOString().split("T")[0]}</td>
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Article</ModalHeader>
          <ModalBody>
            <FormControl id="title" isRequired mt={4}>
              <FormLabel>Title</FormLabel>
              <Input
                value={editData?.title || ""}
                onChange={(e) => handleInputChange(e, "title")}
                placeholder="Enter title"
              />
            </FormControl>
            <FormControl id="intro" isRequired mt={4}>
              <FormLabel>Introduction</FormLabel>
              <Textarea
                value={editData?.intro || ""}
                onChange={(e) => handleInputChange(e, "intro")}
                placeholder="Enter introduction"
              />
            </FormControl>
            <FormControl id="tags" isRequired mt={4}>
              <FormLabel>Tags</FormLabel>
              <Input
                value={editData?.tags || ""}
                onChange={(e) => handleInputChange(e, "tags")}
                placeholder="Enter tags"
              />
            </FormControl>
            <FormControl id="email" isRequired mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={editData?.email || ""}
                onChange={(e) => handleInputChange(e, "email")}
                placeholder="Enter email"
              />
            </FormControl>
            <FormControl id="files" mt={4}>
              <FormLabel>Change Image</FormLabel>
              <Input
                type="file"
                onChange={(e) => handleImageUpload(e, false)}
              />
            </FormControl>
            <FormControl
              id="confirmed"
              mt={4}
              display="flex"
              alignItems="center"
            >
              <FormLabel>Confirmed</FormLabel>
              <input
                type="checkbox"
                checked={editData?.confirmed || false}
                onChange={(e) =>
                  setEditData((prev) =>
                    prev ? { ...prev, confirmed: e.target.checked } : null
                  )
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="ghost" onClick={onClose} className="ml-3">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* New Article Modal */}
      <Modal isOpen={isNewOpen} onClose={onNewClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Article</ModalHeader>
          <ModalBody>
            <FormControl id="title" isRequired mt={4}>
              <FormLabel>Title</FormLabel>
              <Input
                value={newData?.title || ""}
                onChange={(e) => handleInputChange(e, "title", true)}
                placeholder="Enter title"
              />
            </FormControl>
            <FormControl id="intro" isRequired mt={4}>
              <FormLabel>Introduction</FormLabel>
              <Textarea
                value={newData?.intro || ""}
                onChange={(e) => handleInputChange(e, "intro", true)}
                placeholder="Enter introduction"
              />
            </FormControl>
            <FormControl id="tags" isRequired mt={4}>
              <FormLabel>Tags</FormLabel>
              <Input
                value={newData?.tags || ""}
                onChange={(e) => handleInputChange(e, "tags", true)}
                placeholder="Enter tags"
              />
            </FormControl>
            <FormControl id="email" isRequired mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={newData?.email || ""}
                onChange={(e) => handleInputChange(e, "email", true)}
                placeholder="Enter email"
              />
            </FormControl>
            <FormControl id="files" isRequired mt={4}>
              <FormLabel>Image</FormLabel>
              <Input type="file" onChange={(e) => handleImageUpload(e, true)} />
            </FormControl>
            <FormControl
              id="confirmed"
              mt={4}
              display="flex"
              alignItems="center"
            >
              <FormLabel>Confirmed</FormLabel>
              <input
                type="checkbox"
                checked={newData?.confirmed}
                onChange={(e) =>
                  setNewData((prev) => ({
                    ...prev,
                    confirmed: e.target.checked,
                  }))
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCreateArticle}>
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

export default Article;
