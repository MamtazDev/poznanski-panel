import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverTrigger,
  Select,
  Tag,
  TagCloseButton,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  PopoverContent
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
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
import CommonButton from "../../../Components/Buttons/CommonButton";
import { AiOutlineSearch } from "react-icons/ai";
// import FetcherAlbum from "./FetcherAlbum";
import { getVideoInfoById } from "../../../utils";
import CustomDropdown from "../../../Components/TextField/CustomeDropDown";

// Define types for the data
interface Material {
  _id: string;
  title: string;
  description: string;
  youTube: string;
  tags: string;
  date: string;
  artists: string;
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
    artists: string;
    youTube: string;
  }[];
  handleEdit?: (id: string) => void;
  handleDelete?: (id: string) => void;
  handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedPage?: string;
  setSelectedPage?: React.Dispatch<React.SetStateAction<string>>;
  pageNum?: string;
}

const AlbumContent: React.FC<TableProps> = (props) => {
  const [radioData, setRadioData] = useState<{ album: Material[] }>({
    album: [],
  });
  const [editData, setEditData] = useState<Material | null>(null);
  const [artistData, setArtistData] = useState<any[]>([]);
  const [songsList, setSongsList] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const artistAllData: any = artistData as any;

  // Fetch artist data
  useEffect(() => {
    apiGetReq("/artist", {}).then((res) => {
      setArtistData(res?.data || []);
    });
  }, []);

  // const [themeMode, setThemeMode] = useState<boolean>(true);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [newData, setNewData] = useState<any>({
    userId: "6790c75af5c1e10f364abfd9",
    title: "",
    youTube: "",
    description: "",
    tags: "",
    artists: [],
    songs: [],
    date: "",
  });
  // console.log(newData, " new data");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isNewOpen,
    onOpen: onNewOpen,
    onClose: onNewClose,
  } = useDisclosure();

  const toast = useToast();

  // Fetch data
  const [materials, setMaterials] = useState<Material[]>([]);
  const [album, setAlbumes] = useState<any>([]);

  useEffect(() => {
    // apiGetReq("/materials", { limit: 100 }).then((res) => {
    //   // console.log(res, "materials data");

    //   if (res && Array.isArray(res.materials)) {
    //     setMaterials(res.materials);
    //   } else {
    //     setMaterials([]);
    //     console.error("Invalid response format:", res);
    //   }
    // });

    apiGetReq("/album", { limit: 100 }).then((res) => {
      // console.log(res, "album data");

      if (res && Array.isArray(res.albums)) {
        setAlbumes(res.albums);
      } else {
        setAlbumes([]);
        console.error("Invalid response format:", res);
      }
    });
  }, []);

  useEffect(() => {
    // console.log("albumes", albumes)
  }, [album]);

  // Edit item
  const handleEdit = (id: string) => {
    // console.log("Editing item:", id);
    const selectedItem = album.find((item: any) => item._id === id);
    if (selectedItem) {
      // console.log("Found item:", selectedItem);
      setEditData({ ...selectedItem });
      onOpen();
    } else {
      // console.log("Item not found");
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
      const res = await apiDeleteReq(`/album/${id}`, {});
      if (res?._id) {
        toast({
          title: "Deleted successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        // setAlbumes((prev:any) => ({
        //   album: prev.album.filter((item:any) => item._id !== id),
        // }));
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

  // handle save is used for update
  const handleSave = async () => {
    if (!editData || !editData._id) return;
    const updatedData = {
      title: editData.title,
      description: editData.description,
      youTube: editData.youTube,
      tags: editData.tags,
      date: editData.date,
      artists: editData.artists,
    };

    try {
      const res = await apiPutReq(`/album/${editData._id}`, updatedData);
      if (res) {
        setRadioData((prev) => ({
          album: prev.album.map((item) =>
            item._id === editData._id ? { ...item, ...res.data } : item
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
      userId: "6790c75af5c1e10f364abfd9",
      title: "",
      artists: [],
      songs: [],
      description: "",
      youTube: "",
      tags: "",
      date: "2025-01-28T12:00:00.000Z",
    });
    onNewOpen();
  };

  const handleCreatePost = async () => {
    const reqData = { ...newData, songs: songsList };
    try {
      const res = await apiPostReq("/album", reqData);

      if (res.title) {
        setAlbumes((prev: any) => ({
          album: [res.data],
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
      // console.error("Error creating new material:", error);
      toast({
        title: "Server error while creating post",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNewInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: string
  ) => {
    setNewData((prev: any) => ({
      ...prev,
      [field]: field === "artists" ? [e.target.value] : e.target.value,
    }));
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

  const debounceTimerNew = useRef<NodeJS.Timeout | null>(null);
  const debounceTimerEdit = useRef<NodeJS.Timeout | null>(null);

  const getVideoId = async (url: string, setData: any) => {
    const id = url.split("v=")[1]?.split("&")[0] || null;
    if (id) {
      const videoInfo = await getVideoInfoById(id);
      console.log("videoInfo", videoInfo);

      if (videoInfo) {
        setData((prev: any) => ({
          ...prev,
          youTube: url,
          title: videoInfo.title || prev.title,
          description: videoInfo.description || prev.description,
          tags:
            videoInfo.tags?.length > 0 ? videoInfo.tags.join(", ") : prev.tags,
        }),
        setTags(videoInfo.tags )
      );
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
  const [tagInput, setTagInput] = useState("");

  const handleEditYoutubeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setEditData((prev: any) => ({ ...prev, youTube: url }));

    if (debounceTimerEdit.current) clearTimeout(debounceTimerEdit.current);

    debounceTimerEdit.current = setTimeout(() => {
      getVideoId(url, setEditData);
    }, 1200);
  };

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

  return (
    <div className="p-3 overflow-y-auto w-full h-full pb-28">
      {/* <FetcherAlbum /> */}
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
              <th className="px-6 py-3" style={{ width: "50px" }}>
                Title
              </th>
              {/* <th className="px-6 py-3" style={{ width: "130px" }}>
                Video
              </th> */}
              <th className="px-6 py-3" style={{ width: "320px" }}>
                Tags
              </th>
              <th className="px-6 py-3" style={{ width: "100px" }}>
                Date
              </th>
              <th className="px-6 py-3" style={{ width: "50px" }}>
                Description
              </th>
              <th className="px-6 py-3" style={{ width: "130px" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {album.length > 0 ? (
              album?.map((item: any, index: number) => (
                <tr
                  key={index}
                  className={`border-b py-4  ${
                    !themeMode
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                      : "bg-white text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  <td className="p-4">
                    <p className="truncate max-w-[200px]">{item.title}</p>
                  </td>
                  {/* <td className="px-4 py-3">
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
                  </td> */}
                  <td className="py-4">
                  {/* <div className="flex flex-wrap gap-2 max-h-12 overflow-y-auto">
                    {item.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-900 text-white text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div> */}
                    <TagDisplay tags={item.tags} /> 
                  </td>


                  <td className="py-4">
                    {new Date(item.date).toISOString().split("T")[0]}
                  </td>
                  <td className="py-4">
                    <p className="truncate max-w-[300px]">{item.description}</p>
                  </td>
                  <td className="text-center py-4">
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
                  value={editData?.title || ""}
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
                  value={editData?.youTube || ""}
                  onChange={(e) => handleEditYoutubeUrl(e)}
                  placeholder="Enter YouTube Link"
                />
              </FormControl>
            </ModalBody>
            <ModalBody>
              {/* description */}
              <FormControl id="description" isRequired mt={4}>
                <FormLabel>Description</FormLabel>
                <Input
                  value={editData?.description || ""}
                  onChange={(e) => handleInputChange(e, "description")}
                  placeholder="Enter description"
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
              {/* <FormControl id="date" isRequired mt={4}>
                <FormLabel>Date</FormLabel>
                <Input
                  value={editData?.date}
                  onChange={(e) => handleInputChange(e, "date")}
                  placeholder="Enter date"
                />
              </FormControl> */}
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
      <Modal isOpen={isNewOpen} onClose={onNewClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <div
            className={`${
              themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
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

              <FormControl isRequired>
                <FormLabel>Songs</FormLabel>
                <CustomDropdown setSongsList={setSongsList} />
              </FormControl>

              <FormControl id="title" isRequired mt={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  value={newData.title || ""}
                  onChange={(e) => handleNewInputChange(e, "title")}
                  placeholder="Enter title"
                />
              </FormControl>
              <FormControl id="tags" isRequired mt={4}>
                <FormLabel>tags</FormLabel>
                {/* <Input
                  value={newData.tags || " "}
                  onChange={(e) => handleNewInputChange(e, "tags")}
                  placeholder="Enter tags"
                /> */}
                <Input
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyPress={handleTagInputKeyPress}
                  placeholder="Enter tags (one word, press Enter to add)"
                />
                <HStack mt={2} spacing={2}>
                  <div className="flex gap-1   flex-wrap">
                    {tags.map((tag: any) => (
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

              {/* Description */}
              <FormControl id="description" isRequired mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={newData.description || ""}
                  onChange={(e) => handleNewInputChange(e, "description")}
                  placeholder="Enter description"
                />
              </FormControl>

              {/* Link */}
              <FormControl id="youTube" mt={4}>
                <FormLabel>Link</FormLabel>
                <Input
                  value={newData.youTube}
                  onChange={(e) => handleYoutubeUrl(e)}
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

export default AlbumContent;


const TagDisplay = ({ tags }: { tags: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover 
      isOpen={isOpen} 
      onOpen={() => setIsOpen(true)} 
      onClose={() => setIsOpen(false)}
      trigger="hover"
      placement="top"
    >
      <PopoverTrigger>
        <div className="max-w-[200px] truncate cursor-pointer border border-gray-300 px-2 py-1 rounded-md">
          {tags.join(", ")}
        </div>
      </PopoverTrigger>

      <PopoverContent w="fit-content" maxW="300px">
        <PopoverBody className="flex flex-wrap gap-2 p-3 max-h-[150px] overflow-y-auto">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-900 text-white text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};