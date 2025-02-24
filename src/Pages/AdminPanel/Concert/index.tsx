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
  Text,
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
  const [featuredData, setFeaturedData] = useState<any[]>([]);
  const [editData, setEditData] = useState<any | null>(null);
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

  useEffect(() => {
    apiGetReq("/concert", {}).then((res) => {
      setRadioData(res.products);
      setFeaturedData(res.isFeatured);
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
    onClose();

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
      <div className="flex justify-between">
        <div
          className={`mb-4 ${themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
            }`}
          style={{ width: "300px" }}>
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
            className={`text-xs uppercase ${themeMode
                ? "text-white bg-[#5A1073]"
                : "bg-[#3bd6c6] text-[#5A1073]"
              }`}>
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
            {radioData?.map((item, index) => {
              return (
                <tr
                  key={index}
                  className={`border-b py-4  ${!themeMode
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                      : "bg-white text-gray-900 hover:bg-gray-200"
                    }`}>
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
                      className={` py-2 px-4 rounded-md ${themeMode ? "bg-gray-100" : "bg-gray-900"}`}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 font-semibold flex items-center gap-2 justify-center">
                        Preview
                        <MdOutlineArrowOutward />
                      </a>
                    </button>
                  </td>
                  <td className="text-center px-2">
                    {item.description.length > 30
                      ? `${item.description.substring(0, 30)}..`
                      : item.description}
                  </td>
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
              );
            })}

            {featuredData.length > 0 ? (
              featuredData.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={`border-b py-4  ${!themeMode
                        ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                        : "bg-white text-gray-900 hover:bg-gray-200"
                      }`}>
                    <td>
                      <img
                        src={item.img || img}
                        alt={item.name}
                        className="rounded-full w-[50px] h-[50px] my-2 flex items-center mx-auto"
                      />
                    </td>
                    <td>
                      <p className="w-[200px] truncate">{item.name}</p>
                    </td>
                    <td>{item.category || "N/A"}</td>
                    <td>{item.location}</td>
                    <td>
                      <button
                        className={` py-2 px-4 rounded-md ${themeMode ? "bg-gray-100" : "bg-gray-900"}`}>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 font-semibold flex items-center gap-2 justify-center">
                          Preview
                          <MdOutlineArrowOutward />
                        </a>
                      </button>
                    </td>
                    <td className="text-center">
                      <p className="w-[500px] truncate">{item.description}</p>
                    </td>
                    <td className="text-center">
                      {item.isFeatured === true ? "Featured" : "Not Featured"}
                    </td>
                    <td>
                      {
                        new Date(item.timeframe.start)
                          .toISOString()
                          .split("T")[0]
                      }
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
                );
              })
            ) : (
              <tr className="relative" style={{ height: "400px" }}>
                <td className="absolute top-1/2 left-1/2 w-32 -translate-x-1/2 -translate-y-1/2">
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
              }`}>
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
              {/* <FormControl id="timeframe" mt={4}>
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
              </FormControl> */}

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
            className={` ${themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
              }`}>
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
                className="mr-3">
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
