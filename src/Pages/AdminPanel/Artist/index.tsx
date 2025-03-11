import React, { useEffect, useState } from "react";
import { fileUrl } from "../../../Constant/config";
import {
  apiDeleteReq,
  apiGetReq,
  apiPostReq,
  apiPutReq,
} from "../../../Constant/api-functions";
import { InputGroup, InputRightElement, Input } from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
import ConfirmModal from "../../../Components/Modals/ConfirmModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import ArtistTable from "../../../Components/Tables/ArtistTable";
import ArtistModal from "../../../Components/Modals/ArtistModal";
import "../style.css";
import CommonButton from "../../../Components/Buttons/CommonButton";

interface Product {
  id: string;
  name: string;
  profileImg: string;
  star: number;
  description: string;
}
interface inputProducts {
  _id: string;
  name: string;
  profileImg: string;
  star: number;
  description: string;
}

interface Tag {
  _id: string;
  name: string;
}

const ArticleContent = () => {
  const [cardData, setCardData] = useState<Product[]>([]);
  const [modalData, setModalData] = useState<Product>({
    id: "",
    name: "",
    profileImg: "",
    star: 0,
    description: "",
  });
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPage, setSelectedPage] = useState<string>("1");
  const [selectedRowsNum, setSelectedRowsNum] = useState<number>(5);
  const [filterText, setFilterText] = useState<string>("");
  const [pageNum, setPageNum] = useState<string>("1");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);

  const handleData = (response: any) => {
    let newProducts: Product[] = [];
    const pages = Math.ceil(response.total / selectedRowsNum);
    setPageNum(pages.toString());

    response.data.forEach((item: any) => {
      const artist = item.artist;
      const profileImg = artist.profileImg.startsWith("http")
        ? artist.profileImg
        : fileUrl + artist.profileImg;

      const temp: Product = {
        id: artist._id,
        name: artist.name,
        profileImg, // Use corrected profileImg
        description: artist.description,
        star: artist.star,
      };
      newProducts.push(temp);
    });

    setCardData(newProducts);
  };

  useEffect(() => {
    apiGetReq(`/artist`, {})
      .then((res) => {
        if (res.success) {
          handleData(res);
        } else {
          console.error("Failed to fetch data:", res);
        }
      })
      .catch((err) => console.error("API error:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRowsNum(parseInt(e.target.value));
  };

  const handleChangeFilterText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const handleEdit = (id: string) => {
    setModalData(cardData.filter((item) => item.id === id)[0]);
    setOpenEditModal(true);
  };

  const handleDelete = (id: string) => {
    setModalData(cardData.filter((item) => item.id === id)[0]);
    setOpenDeleteModal(true);
  };

  const handleAddArtist = () => {
    setModalData({
      id: "",
      name: "",
      profileImg: "",
      star: 0,
      description: "",
    });
    setOpenAddModal(true);
  };

  const handleEditData = () => {
    apiPutReq(`/artist/${modalData.id}`, modalData).then((res) => {
      if (res.success) {
        setCardData((prevState) =>
          prevState.map((item) =>
            item.id === res.data._id
              ? {
                  ...item,
                  name: res.data.name,
                  profileImg: modalData.profileImg,
                  description: res.data.description,
                  star: res.data.star,
                }
              : item
          )
        );
      }
    });
    setOpenEditModal(false);
  };

  const handleAddData = () => {
    apiPostReq("/artist", modalData).then((res) => {
      if (res.success) {
        setCardData((prevState) => [
          ...prevState,
          {
            id: res.data._id,
            name: res.data.name,
            profileImg: fileUrl + res.data.profileImg,
            description: res.data.description,
            star: res.data.star,
          },
        ]);
      }
    });
    setOpenAddModal(false);
  };

  const handleDeleteData = () => {
    apiDeleteReq("/artist", { id: modalData.id }).then((res) => {
      if (res.success) {
        if (res.deleted) {
          setCardData((prevState) =>
            prevState.filter((item) => item.id !== modalData.id)
          );
        } else {
          console.error("No match that news!");
        }
      } else {
        console.error("server error!");
      }
    });
    setOpenDeleteModal(false);
  };

  const filteredData = cardData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-3 overflow-y-auto w-full h-full pb-28">
      <div className="flex md:justify-between gap-2">
        <div
          className={`mb-4 md:w-[300px] w-[276px] ${
            themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
          }`}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputRightElement pointerEvents="none">
              <AiOutlineSearch />
            </InputRightElement>
          </InputGroup>
        </div>
        <CommonButton text="Add artist" onClick={handleAddArtist} />
      </div>

      <ArtistTable
        themeMode={themeMode}
        cardData={cardData}
        filteredData={filteredData}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleChange={handleChange}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        pageNum={pageNum}
      />

      <ConfirmModal
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        handleOk={handleDeleteData}
        text="Are you sure you want to delete this artist?"
      />

      <ArtistModal
        isOpen={openEditModal}
        setIsOpen={setOpenEditModal}
        handleOk={handleEditData}
        data={modalData}
        setData={setModalData}
      />

      <ArtistModal
        isOpen={openAddModal}
        setIsOpen={setOpenAddModal}
        handleOk={handleAddData}
        data={modalData}
        setData={setModalData}
      />
    </div>
  );
};

export default ArticleContent;
