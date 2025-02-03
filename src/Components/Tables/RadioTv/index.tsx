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

  console.log(newData, "new datanew datanew datanew data")

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

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    try {
      const res = await apiDeleteReq(`/radio/${id} `, {});
      if (res) {
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
      setRadioData(res);
    });
  }, []);

  return (
    <>

      <div className="flex items-center justify-end py-5">
        <Button colorScheme="green" onClick={handleNewPost}>
          Add New Item
        </Button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full h-full" style={{ minWidth: "400px" }}>
          <thead
            className={`text-xs uppercase ${props.themeMode
              ? " text-gray-700  bg-gray-400"
              : "bg-gray-700 text-gray-400"
              }`}
          >
            <tr>
              <th className="px-6 py-3" style={{ width: "130px" }}>
                Name
              </th>
              <th className="px-6 py-3" style={{ width: "130px" }}>
                Image
              </th>
              <th className="px-6 py-3" style={{ width: "130px" }}>
                Description
              </th>
              <th className="px-6 py-3" style={{ width: "130px" }}>
                Video
              </th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3 w-28">Tag</th>
              <th className="px-6 py-3 w-28">Star</th>
              <th className="px-6 py-3 w-28">Action</th>
            </tr>
          </thead>

          <tbody>
            {radioData.length ? (
              radioData.map((item, idx) => (
                <tr
                  key={`article-table-${idx}`}
                  className={`border-b ${!props.themeMode
                    ? "bg-gray-800 border-gray-700 text-gray-200"
                    : "bg-white text-gray-900"
                    }`}
                >
                  <td>{item?.artists?.map((i: any) => i.name)}</td>
                  <td>
                    <img
                      src={item?.thumbnail || "https://placehold.co/50x50"}
                      alt="profile"
                      className="w-20 h-20 rounded-full"
                    />
                  </td>
                  <td>{item?.description}</td>
                  <td>
                    <iframe
                      src={
                        item?.youTube?.includes("youtube.com/watch")
                          ? `https://www.youtube.com/embed/${item?.youTube?.split("v=")[1]}`
                          : item?.youTube ||
                          "https://www.youtube.com/embed/6JYIGclVQdw"
                      }
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      frameBorder="0"
                      width="300"
                      height="150"
                    ></iframe>
                  </td>
                  <td style={{ width: "200px" }}>{item?.title}</td>
                  <td>{item?.tags}</td>
                  <td>{item?.artists?.map((i: any) => i.star)}</td>
                  <td>
                    <div className="flex justify-center space-x-2">
                      <Button onClick={() => handleEdit(item._id)}>Edit</Button>
                      <Button onClick={() => handleDelete(item._id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="relative" style={{ height: "400px" }}>
                <div className="absolute top-1/2 left-1/2 w-32 -translate-x-1/2 -translate-y-1/2">
                  <img src={tableIcon} alt="table-icon" />
                  <p>No content available</p>
                </div>
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
            {/* artist */}
            <FormControl id="artist" isRequired>
              <FormLabel>Artist</FormLabel>
              <Select
                placeholder="Select Artist"
                value={editData?.artists || ""}
                onChange={(e) => handleInputChange(e, "artists")}
              >
                {
                  artistAllData.length > 0 ? (
                    artistAllData.map((items: any, index: number) => (
                      <option key={index} value={items.artist._id}>
                        {items.artist.name}
                      </option>
                    ))
                  ) : (<><p>no data found</p></>)
                }
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
            <FormControl isRequired>
              <FormLabel>Artist</FormLabel>
              <Select
                placeholder="Select Artist"
                value={newData?.artists}
                onChange={(e) => handleNewInputChange(e, "artists")}
              >
                {
                  artistAllData.length > 0 ? (artistAllData?.map((items: any, index: number) => (
                    <option key={index} value={items.artist._id}>
                      {items.artist.name}
                    </option>
                  ))) : (<p>No data found</p>)
                }
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
            <Button colorScheme="blue" onClick={handleCreatePost}>
              Save
            </Button>
            <Button variant="ghost" onClick={onNewClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RadioTv;
