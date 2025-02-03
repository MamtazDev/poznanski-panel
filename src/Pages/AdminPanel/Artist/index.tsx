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
  const [selectedPage, setSelectedPage] = useState<string>("1");
  const [selectedRowsNum, setSelectedRowsNum] = useState<number>(5);
  const [filterText, setFilterText] = useState<string>("");
  const [pageNum, setPageNum] = useState<string>("1");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);

  const handleData = (response: any) => {
    let newProducts: Product[] = [];
    const pages = Math.ceil(response.all / selectedRowsNum);
    setPageNum(pages.toString());
    response.products.map((item: inputProducts) => {
      const temp: Product = {
        id: item._id,
        name: item.name,
        profileImg: fileUrl + item.profileImg,
        description: item.description,
        star: item.star,
      };
      newProducts.push(temp);
    });
    setCardData(newProducts);
  };

  useEffect(() => {
    apiGetReq(`/artist/data`, {
      rowsPerPage: selectedRowsNum,
      curPage: selectedPage,
      filter: filterText,
    }).then((res) => {
      handleData(res);
    });
  }, []);

  useEffect(() => {
    apiGetReq(`/artist/data`, {
      rowsPerPage: selectedRowsNum,
      curPage: selectedPage,
      filter: filterText,
    }).then((res) => {
      handleData(res);
    });
  }, [selectedPage, selectedRowsNum, filterText]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRowsNum(parseInt(e.target.value));
  };

  const handleChangeFilterText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const handleEdit = (id: string) => {
    console.log("edit:", id);
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
    console.log(modalData);
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
    console.log(cardData);
    setOpenAddModal(false);
  };

  const handleDeleteData = () => {
    console.log("deleting:", modalData);
    apiDeleteReq("/artist", { id: modalData.id }).then((res) => {
      if (res.success) {
        if (res.deleted) {
          setCardData((prevState) =>
            prevState.filter((item) => item.id !== modalData.id)
          );
        } else {
          console.log("No match that news!");
        }
      } else {
        console.log("server error!");
      }
    });
    setOpenDeleteModal(false);
  };

  return (
    <div className="p-3 overflow-y-auto w-full h-full pb-28">
      <div className="flex justify-between">
        <div className="mb-4" style={{ width: "300px" }}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Search..."
              backgroundColor="white"
              onChange={handleChangeFilterText}
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
