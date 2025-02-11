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
import tableIcon from "../../../assets/svg/icons-table.svg";
import CommonButton from "../../Buttons/CommonButton";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

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

const RadioTv: React.FC<TableProps> = (props) => {
  const [radioData, setRadioData] = useState<any[]>([]);
  const [artistData, setArtistData] = useState<any[]>([]);
  const [editData, setEditData] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [newData, setNewData] = useState<any>({
    title: "",
    description: "",
    youTube: "",
    thumbnail: "",
    artists: [],
    userId: "6790c75af5c1e10f364abfd9",
    tags: "",
    date: new Date().toISOString(),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isNewOpen,
    onOpen: onNewOpen,
    onClose: onNewClose,
  } = useDisclosure();

  const artistAllData: ArtistData[] = artistData as ArtistData[];
  const toast = useToast();

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

  // const handleDelete = async (id: string) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this item?",
  //   );
  //   if (!confirmDelete) return;

  //   try {
  //     const res = await apiDeleteReq(`/radio/${id} `, {});
  //     if (res) {
  //       toast({
  //         title: "Deleted successfully!",
  //         status: "success",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //       setRadioData((prev) => prev.filter((item) => item._id !== id));
  //     } else {
  //       toast({
  //         title: "Failed to delete",
  //         status: "error",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error deleting:", error);
  //     toast({
  //       title: "Error deleting item",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // };
  const handleDelete = async (id: string) => {
    // Show confirmation toast
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
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "center", gap: "10px" }}>
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
            <Button size="sm" onClick={onClose}>Cancel</Button>
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

  const handleNewPost = () => {
    setNewData({
      title: "",
      description: "",
      youTube: "",
      thumbnail: "",
      artists: [],
      userId: "6790c75af5c1e10f364abfd9",
      tags: "",
      date: new Date().toISOString(),
    });
    onNewOpen();
  };

  const handleCreatePost = async () => {
    try {
      const res = await apiPostReq("/radio", newData);
      if (res) {
        // addded res.data
        setRadioData((prev) => [...prev, res]);
        onNewClose();
      }
    } catch (error) {
      console.error("Error creating new radio item:", error);
    }
  };

  useEffect(() => {
    apiGetReq("/radio", {}).then((res) => {
      console.log(res.records);
      setRadioData(res.records);
    });
  }, []);

  return (
    <>
      {/* <div className="flex items-center justify-end py-5">
      
        <CommonButton text="Add new Item" onClick={handleNewPost} />
      </div> */}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full h-full" style={{ minWidth: "400px" }}>
          <thead
            className={`text-xs uppercase ${
              props. themeMode
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
              {/* <th className="px-6 py-3 w-28">Star</th> */}
              <th className="px-6 py-3 w-28">Action</th>
            </tr>
          </thead>
          <tbody>
            {radioData?.map((item, idx) => (
              <tr
                key={`article-table-${idx}`}
                className={`border-b  ${
                  !props.themeMode
                    ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                    : "bg-white text-gray-900 hover:bg-gray-200"
                }`}
              >
               <td className="px-4 py-3">{item?.title}</td>
                <td className="px-4 py-3 ">
                  <img
                    src={item?.thumbnail || "https://placehold.co/50x50"}
                    alt="profile"
                    className="w-[50px] h-[50px] rounded-full object-cover  flex items-center mx-auto"
                  />
                </td>
                <td className="px-4 py-3">{item?.description}</td>
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
                <td className="px-4 py-3">{item?.tags}</td>
                {/* <td className="px-4 py-3">
                  {item?.artists?.map((i:any) => i.star)}
                </td> */}
                <td className="px-4 py-3">
                  <div className="flex justify-center space-x-2">
                    <button onClick={() => handleEdit(item._id)}><FaRegEdit /></button>
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
         <div className={` ${
            props.themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
          }`}>
         <ModalHeader>Edit Item</ModalHeader>
          <ModalBody>
            {/* artist */}
            <FormControl id="artist" isRequired>
              <FormLabel>Artist</FormLabel>
              <Select
                placeholder="Select Artist"
                value={editData?.artists || ""}
                onChange={(e) => handleInputChange(e, "artists")}
              >
                {artistAllData.length > 0 ? (
                  artistAllData.map((items: any, index: number) => (
                    <option key={index} value={items.artist._id}>
                      {items.artist.name}
                    </option>
                  ))
                ) : (
                  <>
                    <p>no data found</p>
                  </>
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
                onChange={(e) => handleInputChange(e, "youTube")}
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
         <div className={` ${
            props.themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
          }`}>
         <ModalHeader>Add New Item</ModalHeader>
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Artist</FormLabel>
              <Select
                placeholder="Select Artist"
                value={newData?.artists}
                onChange={(e) => handleNewInputChange(e, "artists")}
              >
                {artistAllData.length > 0 ? (
                  artistAllData?.map((items: any, index: number) => (
                    <option key={index} value={items.artist._id}>
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
                onChange={(e) => handleNewInputChange(e, "youTube")}
                placeholder="Enter YouTube URL"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tags</FormLabel>
              <Input
                value={newData.tags}
                onChange={(e) => handleNewInputChange(e, "tags")}
                placeholder="Enter tags"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Thumbnail</FormLabel>
              <img
                width={200}
                height={200}
                src={newData?.thumbnail || "https://placehold.co/200x200"}
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
            <Button colorScheme="blue" onClick={handleCreatePost} className="mr-3">
              Save
            </Button>
            <Button variant="ghost" onClick={onNewClose}>
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
