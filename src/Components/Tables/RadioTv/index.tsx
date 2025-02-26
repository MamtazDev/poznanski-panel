import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import {
  apiDeleteReq,
  apiGetReq,
  apiPostReq,
  apiPutReq,
} from "../../../Constant/api-functions";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import FolderImage from "../../../assets/png/folder_icon.png";
import { getVideoInfoById } from "../../../utils";
import { useDispatch } from "react-redux";
import { openPlayer } from "../../../reducers/PlayerReducer";

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
  radioData: any[];
  setRadioData: React.Dispatch<React.SetStateAction<any[]>>;
  newData: any;
  setNewData: React.Dispatch<React.SetStateAction<any>>;
  isNewOpen: boolean;
  onNewOpen: () => void;
  onNewClose: () => void;
}

interface Artist {
  _id: string;
  name: string;
  profileImg: string;
  description: string;
  star: number;
  __v: number;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  youTube: string;
  artists: string[];
  userId: string;
  tags: string;
  thumbnail: string;
  date: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ArtistData {
  artist: Artist;
  products: Product[];
}

const RadioTv: React.FC<TableProps> = ({
  themeMode,
  radioData,
  setRadioData,
  newData,
  setNewData,
  isNewOpen,
  onNewOpen,
  onNewClose,
}) => {
  const [artistData, setArtistData] = useState<any[]>([]);
  const [editData, setEditData] = useState<any | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const artistAllData: ArtistData[] = artistData as ArtistData[];
  const toast = useToast();
  const dispatch = useDispatch();

  const getYouTubeID = (url: string) => {
    let videoId = "";
    try {
      if (url.includes("youtube.com/watch?v=")) {
        videoId = new URL(url).searchParams.get("v") || "";
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
      }
    } catch (error) {
      console.error("Error extracting YouTube ID:", error);
    }
    return videoId;
  };


  // const handlePlay = (youTube: any) => {
  //   console.log("Clicked Video URL:", youTube);
  //   if (youTube) {
  //     const videoId = getYouTubeID(youTube);
  //     console.log("Extracted Video ID:", videoId);
  //     if (videoId) {
  //       dispatch(openPlayer(videoId));
  //       console.log("Dispatched Video ID:", videoId);
  //     }
  //   }
  // };

  const handlePlay = (youTube: any) => {
    if (youTube) {
      const videoId = getYouTubeID(youTube);
      if (videoId) {
        dispatch(openPlayer(videoId));
      }
    }
  };



  // Fetch artist data
  useEffect(() => {
    apiGetReq("/artist", {}).then((res) => {
      setArtistData(res?.data || []);
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
      position: "top",
      duration: null,
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
      const res = await apiDeleteReq(`/radio/${id}`, {});
      if (res) {
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
    field: string
  ) => {
    if (editData) {
      setEditData({ ...editData, [field]: e.target.value });
    }
  };

  const handleNewInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: string
  ) => {
    setNewData({ ...newData, [field]: e.target.value });
  };

  const debounceTimerNew = useRef<NodeJS.Timeout | null>(null);
  const debounceTimerEdit = useRef<NodeJS.Timeout | null>(null);

  const getVideoId = async (url: string, setData: any) => {
    const id = url.split("v=")[1]?.split("&")[0] || null;
    if (id) {
      const videoInfo = await getVideoInfoById(id);
      if (videoInfo) {
        setData((prev: any) => ({
          ...prev,
          youTube: url,
          thumbnail: videoInfo.thumbnail || prev.thumbnail,
          title: videoInfo.title || prev.title,
          description: videoInfo.description || prev.description,
          tags:
            videoInfo.tags?.length > 0 ? videoInfo.tags.join(", ") : prev.tags,
        }));
        if (videoInfo.tags?.length > 0) setTags(videoInfo.tags);
      } else {
        setData((prev: any) => ({ ...prev, youTube: url }));
      }
    } else {
      setData((prev: any) => ({ ...prev, youTube: url }));
    }
  };

  const handleYoutubeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNewData((prev: any) => ({ ...prev, youTube: url }));

    if (debounceTimerNew.current) clearTimeout(debounceTimerNew.current);

    debounceTimerNew.current = setTimeout(() => {
      getVideoId(url, setNewData);
    }, 1200);
  };

  const handleEditYoutubeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setEditData((prev: any) => ({ ...prev, youTube: url }));

    if (debounceTimerEdit.current) clearTimeout(debounceTimerEdit.current);

    debounceTimerEdit.current = setTimeout(() => {
      getVideoId(url, setEditData);
    }, 1200);
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
          thumbnail: uploadedImageUrl,
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
          thumbnail: uploadedImageUrl,
        }));
      }
    }
  };

  const handleSave = async () => {
    if (!editData || !editData._id) return;

    const updatedData = {
      title: editData.title,
      description: editData.description,
      youTube: editData.youTube,
      tags: editData.tags,
      thumbnail: editData.thumbnail,
      artists: editData.artists,
    };

    try {
      const res = await apiPutReq(`/radio/${editData._id}`, updatedData);
      if (res) {
        setRadioData((prev) =>
          prev.map((item) =>
            item._id === editData._id ? { ...item, ...res.data } : item
          )
        );
        onClose();
        setEditData(null);
      }
    } catch (error) {
      console.error("Error updating radio:", error);
    }
  };

  const handleCreatePost = async () => {
    try {
      console.log("newData", newData);
      const res = await apiPostReq("/radio", newData);
      if (res) {
        setRadioData((prev) => [...prev, res]);
        onNewClose();
      }
    } catch (error) {
      console.error("Error creating new radio item:", error);
    }
  };

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent spaces
    const value = e.target.value.replace(/\s+/g, "");
    setTagInput(value);
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      // Prevent duplicate tags
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setNewData({ ...newData, ["tags"]: [...tags, tagInput.trim()] });
      }
      setTagInput(""); // Clear the input
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    console.log("tags", tags);
  };

  useEffect(() => {
    apiGetReq("/radio?limit=100", {}).then((res) => {
      // console.log(res.records);
      setRadioData(res.records);
    });
  }, []);


  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full h-full" style={{ minWidth: "400px" }}>
          <thead
            className={`text-xs uppercase ${themeMode
              ? "text-white bg-[#5A1073]"
              : "bg-[#3bd6c6] text-[#5A1073]"
              }`}
          >
            <tr>
              <th className="px-6 py-3 w-32">Title</th>
              <th className="px-6 py-3 w-32">Image</th>
              <th className="px-6 py-3 w-32">Description</th>
              <th className="px-6 py-3 w-40">Video</th>
              <th className="px-6 py-3 w-28">Tag</th>
              <th className="px-6 py-3 w-28">Action</th>
            </tr>
          </thead>
          <tbody>
            {radioData.length > 0 ? (
              radioData?.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-b  ${!themeMode
                    ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                    : "bg-white text-gray-900 hover:bg-gray-200"
                    }`}
                >
                  <td className="px-4 py-3">
                    <p className="truncate max-w-[200px]">{item?.title}</p>
                  </td>
                  <td className="px-4 py-3 ">
                    <img
                      src={item?.thumbnail || "https://placehold.co/50x50"}
                      alt="profile"
                      className="w-[50px] h-[50px] rounded-full object-cover  flex items-center mx-auto"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="truncate max-w-[300px]">
                      {item?.description}
                    </p>
                  </td>
                  {/* <td className="px-4 py-3">
                    {/* <div className="flex justify-center">
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
                        // frameBorder="0"
                        className="w-40 h-24 md: rounded-lg shadow-lg"
                      ></iframe>
                    </div>
                    <div className={`relative lg:bg-gray-100 cursor-pointer lg:h-48 rounded-md flex-shrink-0 overflow-hidden ${!themeMode && "dark-bg-color"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(item?.youTube);
                      }}

                      >
                      <img
                        src={item?.youTube ? `https://img.youtube.com/vi/${getYouTubeID(item?.youTube)}/hqdefault.jpg` : "default-thumbnail.jpg"}
                        className="md:w-full w-[69px] h-full  object-cover"
                        alt="YouTube Thumbnail"
                      />

                      <div className="absolute inset-0 flex items-center justify-center">
                        {themeMode ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="58" height="57" viewBox="0 0 58 57" fill="none" className="w-[20px] md:w-[58px]">
                            <circle cx="29" cy="28.5" r="28" fill="#5A1073" />
                            <path d="M22.6 17.3L41.8 28.8L22.2 39.6L22.6 17.3Z" fill="white" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55" fill="none" className="w-[20px] md:w-[58px]">
                            <circle cx="27.5" cy="27.5" r="27.5" fill="#2FC4B2" />
                            <path d="M20.8 16L39.3 27.1L20.5 37.5L20.8 16Z" fill="#111217" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </td> */}
                  <td className="px-4 py-3">
                    <div className={`relative lg:bg-gray-100 cursor-pointer lg:h-48 rounded-md flex-shrink-0 overflow-hidden ${!themeMode && "dark-bg-color"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(item?.youTube);
                      }}
                    >
                      <img
                        src={item?.youTube ? `https://img.youtube.com/vi/${getYouTubeID(item?.youTube)}/hqdefault.jpg` : "default-thumbnail.jpg"}
                        className="md:w-full w-[69px] h-full object-cover"
                        alt="YouTube Thumbnail"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {themeMode ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="58" height="57" viewBox="0 0 58 57" fill="none" className="w-[20px] md:w-[58px]">
                            <circle cx="29" cy="28.5" r="28" fill="#5A1073" />
                            <path d="M22.6 17.3L41.8 28.8L22.2 39.6L22.6 17.3Z" fill="white" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55" fill="none" className="w-[20px] md:w-[58px]">
                            <circle cx="27.5" cy="27.5" r="27.5" fill="#2FC4B2" />
                            <path d="M20.8 16L39.3 27.1L20.5 37.5L20.8 16Z" fill="#111217" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">   {item?.tags && item?.tags.split(',').length > 0
                    ? (
                      <>
                        {item?.tags.split(',').slice(0, 3).join(", ")}
                       <span style={{}}> {item?.tags.split(',').length > 3 && ' and more...'}</span>
                      </>
                    )
                    : "No tags available"}</td>

                  <td className="px-4 py-3">
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
                <td className="absolute top-1/2 left-1/2 w-32 -translate-x-1/2 -translate-y-1/2">
                  <svg
                    className="svg-icon"
                    viewBox="0 0 1567 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M156.662278 699.758173h21.097186A10.444152 10.444152 0 0 1 187.994733 710.202325c0 5.765172-4.490985 10.444152-10.235269 10.444152H156.662278v21.097186A10.444152 10.444152 0 0 1 146.218126 751.978932a10.277045 10.277045 0 0 1-10.444152-10.235269V720.646477H114.676787A10.444152 10.444152 0 0 1 104.441518 710.202325c0-5.765172 4.490985-10.444152 10.235269-10.444152H135.773974v-21.097187A10.444152 10.444152 0 0 1 146.218126 668.425717c5.765172 0 10.444152 4.490985 10.444152 10.235269v21.097187z m1378.628042-83.553215v-21.097186A10.277045 10.277045 0 0 0 1524.846168 584.872503a10.444152 10.444152 0 0 0-10.444152 10.235269v21.097186h-21.097186a10.277045 10.277045 0 0 0-10.235269 10.444152c0 5.598065 4.595427 10.444152 10.235269 10.444152h21.097186v21.097187c0 5.744284 4.67898 10.235269 10.444152 10.235268a10.444152 10.444152 0 0 0 10.444152-10.235268V637.093262h21.097187c5.744284 0 10.235269-4.67898 10.235268-10.444152a10.444152 10.444152 0 0 0-10.235268-10.444152H1535.29032zM776.460024 960.861969H250.596979A20.80475 20.80475 0 0 1 229.77134 939.973665c0-11.530344 9.462402-20.888304 20.825639-20.888303h94.728457A83.010119 83.010119 0 0 1 334.212859 877.413196v-605.96969A83.49055 83.49055 0 0 1 417.849627 187.994733H480.430984V167.001988A83.49055 83.49055 0 0 1 564.067752 83.553215h501.152182A83.448773 83.448773 0 0 1 1148.856702 167.001988v605.969689c0 15.185797-4.052331 29.410732-11.133466 41.672166h115.554096c11.551232 0 20.909192 9.274407 20.909192 20.888304 0 11.530344-9.295295 20.888304-20.888304 20.888304H1002.638576v20.992745c0 15.185797-4.052331 29.410732-11.133466 41.672166h11.196131c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304h-109.893365c9.545955 16.000441 7.478013 36.972297-6.41271 50.863019a41.672166 41.672166 0 0 1-59.072122 0L776.460024 960.861969z m76.367638-41.776607h66.424806c22.977134 0 41.609501-18.59059 41.609501-41.881049V270.461756c0-22.559368-18.047494-40.690416-40.314426-40.690416H416.303892c-22.266932 0-40.314426 18.214601-40.314426 40.690416v606.742557c0 23.123352 18.799473 41.881049 41.588613 41.881049h317.084449l-10.736588-10.757477a41.693054 41.693054 0 0 1-10.861918-40.377091l-19.718558-19.739447A146.259902 146.259902 0 0 1 502.363703 627.693525a146.218126 146.218126 0 0 1 220.517822 190.981761l19.739447 19.739447a41.630389 41.630389 0 0 1 40.377091 10.841029L852.827662 919.085362zM1002.638576 814.643843h62.852906A41.797496 41.797496 0 0 0 1107.080095 772.867236V167.106429c0-23.14424-18.632367-41.776607-41.588613-41.776607H563.775316A41.797496 41.797496 0 0 0 522.207592 167.106429v20.888304h396.794216A83.448773 83.448773 0 0 1 1002.638576 271.443506V814.643843zM266.325872 46.998683h31.123572c8.773088 0 15.875111 6.955805 15.875111 15.666228 0 8.647758-7.102023 15.666228-15.875111 15.666228h-31.123572v31.123572c0 8.773088-6.955805 15.875111-15.666228 15.875111a15.770669 15.770669 0 0 1-15.666228-15.875111V78.331139H203.869844A15.728893 15.728893 0 0 1 187.994733 62.664911c0-8.647758 7.102023-15.666228 15.875111-15.666228h31.123572V15.875111c0-8.773088 6.955805-15.875111 15.666228-15.875111 8.647758 0 15.666228 7.102023 15.666228 15.875111v31.123572zM20.888304 939.973665c0-11.530344 9.462402-20.888304 20.825638-20.888303h125.455152c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304H41.713942A20.80475 20.80475 0 0 1 20.888304 939.973665z m658.733544-135.021995a104.441518 104.441518 0 1 0-147.722083-147.722083 104.441518 104.441518 0 0 0 147.722083 147.722083zM459.542681 313.324555a20.888304 20.888304 0 0 1 20.867415-20.888304H710.202325a20.888304 20.888304 0 1 1 0 41.776608H480.430984A20.825639 20.825639 0 0 1 459.542681 313.324555z m0 104.441518c0-11.530344 9.295295-20.888304 20.742085-20.888303h334.505295c11.44679 0 20.742086 9.274407 20.742086 20.888303 0 11.530344-9.295295 20.888304-20.742086 20.888304H480.284766A20.762974 20.762974 0 0 1 459.542681 417.766073z m0 104.441519c0-11.530344 9.316183-20.888304 20.846527-20.888304h146.301679c11.509455 0 20.846527 9.274407 20.846527 20.888304 0 11.530344-9.316183 20.888304-20.846527 20.888303h-146.301679A20.80475 20.80475 0 0 1 459.542681 522.207592zM62.664911 396.87777a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911zM1357.739739 271.547948a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911z"
                      fill="#8A96A3"
                    />
                  </svg>
                  <Text fontSize="lg" color="gray.500">
                    Data is not available
                  </Text>
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
            className={` ${themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
              }`}
          >
            <ModalHeader>Edit Item</ModalHeader>
            <ModalBody>
              {/* artist */}
              <FormControl id="artist" isRequired>
                <FormLabel>Artist</FormLabel>
                <Select
                  placeholder="Select Artist"
                  value={editData?.artists || ""} // Ensure this is a scalar value
                  onChange={(e) => handleInputChange(e, "artists")}
                >
                  {artistAllData.length > 0 ? (
                    artistAllData.map((items: any, index: number) => (
                      <option key={index} value={items.artist._id}>
                        {items.artist.name}
                      </option>
                    ))
                  ) : (
                    <p>No data found</p>
                  )}
                </Select>
              </FormControl>

              <FormControl id="title" isRequired mt={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  value={editData?.title}
                  onChange={(e) => handleInputChange(e, "title")}
                  placeholder="Enter title"
                />
              </FormControl>

              <FormControl id="description" isRequired mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={editData?.description}
                  onChange={(e) => handleInputChange(e, "description")}
                  placeholder="Enter description"
                />
              </FormControl>

              <FormControl id="youTube" mt={4}>
                <FormLabel>YouTube URL</FormLabel>
                <Input
                  value={editData?.youTube}
                  onChange={(e) => handleEditYoutubeUrl(e)}
                  placeholder="Enter YouTube URL"
                />
              </FormControl>

              <FormControl id="tags" mt={4}>
                <FormLabel>Tags</FormLabel>
                <Input
                  value={editData?.tags}
                  onChange={(e) => handleInputChange(e, "tags")}
                  placeholder="Enter tags"
                />
              </FormControl>

              <FormControl id="thumbnail" mt={4}>
                <FormLabel>Thumbnail</FormLabel>
                <img
                  width={200}
                  height={200}
                  src={editData?.thumbnail}
                  alt="Enter thumbnail URL"
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
            className={` ${themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
              }`}
          >
            <ModalHeader>Add New Item</ModalHeader>
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Artist</FormLabel>
                <Select
                  placeholder="Select Artist"
                  value={newData?.artists || []}
                  onChange={(e) => handleNewInputChange(e, "artists")}
                >
                  {artistAllData.length > 0 ? (
                    artistAllData?.map((items: any, index: number) => (
                      <option
                        key={index}
                        value={items.artist._id}
                        className={`${themeMode ? "text-black bg-gray-700" : " text-black bg-gray-700"}`}
                      >
                        {items.artist.name}
                      </option>
                    ))
                  ) : (
                    <p>No data found</p>
                  )}
                </Select>
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  value={newData?.title}
                  onChange={(e) => handleNewInputChange(e, "title")}
                  placeholder="Enter title"
                />
              </FormControl>

              <FormControl isRequired mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={newData?.description}
                  onChange={(e) => handleNewInputChange(e, "description")}
                  placeholder="Enter description"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>YouTube URL</FormLabel>
                <Input
                  value={newData?.youTube}
                  onChange={(e) => handleYoutubeUrl(e)}
                  placeholder="Enter YouTube URL"
                />
              </FormControl>

              {/* <FormControl mt={4}>
                <FormLabel>Tags</FormLabel>
                <Input
                  value={newData.tags}
                  onChange={(e) => handleNewInputChange(e, "tags")}
                  placeholder="Enter tags"
                />
              </FormControl> */}
              <FormControl mt={4}>
                <FormLabel>Tags</FormLabel>
                <Input
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyPress={handleTagInputKeyPress}
                  placeholder="Enter tags (one word, press Enter to add)"
                />
                <HStack mt={2} spacing={2}>
                  <div className="flex gap-1   flex-wrap">
                    {tags.map((tag) => (
                      <Tag key={tag} variant="solid" colorScheme="teal">
                        <p>{tag}</p>
                        <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                      </Tag>
                      // <Tag key={tag} variant="solid" colorScheme="teal">
                      //   <TagLabel>{tag}</TagLabel>
                      //   <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                      // </Tag>
                    ))}
                  </div>
                </HStack>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Thumbnail</FormLabel>
                <img
                  width={200}
                  height={200}
                  src={newData?.thumbnail || FolderImage}
                  alt="Thumbnail Preview"
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
              <Button
                colorScheme="blue"
                onClick={handleCreatePost}
                className="mr-3"
              >
                Save
              </Button>
              <Button variant="red" onClick={onNewClose}>
                Cancel
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RadioTv;
