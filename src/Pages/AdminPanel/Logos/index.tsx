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
import LogoTable from "../../../Components/Tables/LogoTable";
import LogoModal from "../../../Components/Modals/LogoModal";
import "../style.css";
import CommonButton from "../../../Components/Buttons/CommonButton";

interface Logos {
  id: string;
  name: string;
  description: string;
  img1: string;
  img2: string;
}
interface inputLogos {
  _id: string;
  name: string;
  description: string;
  img1: string;
  img2: string;
}

const PartnerLogos = () => {
  const [cardData, setCardData] = useState<Logos[]>([]);
  const [modalData, setModalData] = useState<Logos>({
    id: "",
    name: "",
    description: "",
    img1: "",
    img2: "",
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
    let newProducts: Logos[] = [];
    const pages = Math.ceil(response.all / selectedRowsNum);
    setPageNum(pages.toString());
    response.logos.map((item: inputLogos) => {
      const temp: Logos = {
        id: item._id,
        name: item.name,
        description: item.description,
        img1: fileUrl + item.img1,
        img2: fileUrl + item.img2,
      };
      newProducts.push(temp);
    });
    setCardData(newProducts);
  };

  useEffect(() => {
    apiGetReq(`/logo/admin`, {
      rowsPerPage: selectedRowsNum,
      curPage: selectedPage,
      filter: filterText,
    }).then((res) => {
      handleData(res);
    });
  }, []);

  useEffect(() => {
    apiGetReq(`/logo/admin`, {
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

  const handleEditData = () => {
    console.log(modalData);
    apiPutReq("/logo", modalData).then((res) => {
      if (res.success) {
        setCardData((prevState) =>
          prevState.map((item) =>
            item.id === res.data._id
              ? {
                  ...item,
                  name: res.data.name,
                  description: res.data.description,
                  img1: modalData.img1,
                  img2: modalData.img2,
                }
              : item,
          ),
        );
      }
    });
    console.log(cardData);
    setOpenEditModal(false);
  };

  const handleAddData = () => {
    console.log(modalData);
    apiPostReq("/logo", modalData).then((res) => {
      if (res.success) {
        setCardData((prevState) => [
          ...prevState,
          {
            id: res.data._id,
            name: res.data.name,
            description: res.data.description,
            img1: modalData.img1,
            img2: modalData.img2,
          },
        ]);
      }
    });
    console.log(cardData);
    setOpenAddModal(false);
  };

  const handleAddLogo = () => {
    setModalData({
      id: "",
      name: "",
      description: "",
      img1: "",
      img2: "",
    });
    setOpenAddModal(true);
  };

  const handleDeleteData = () => {
    console.log("deleting:", modalData);
    apiDeleteReq("/logo", { id: modalData.id }).then((res) => {
      if (res.success) {
        if (res.deleted) {
          setCardData((prevState) =>
            prevState.filter((item) => item.id !== modalData.id),
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
        <CommonButton text="Add new logo" onClick={handleAddLogo} />
      </div>
      <LogoTable
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
        text="Are you sure you want to delete this News?"
      />
      <LogoModal
        isOpen={openEditModal}
        setIsOpen={setOpenEditModal}
        handleOk={handleEditData}
        data={modalData}
        setData={setModalData}
      />
      <LogoModal
        isOpen={openAddModal}
        setIsOpen={setOpenAddModal}
        handleOk={handleAddData}
        data={modalData}
        setData={setModalData}
      />
    </div>
  );
};

export default PartnerLogos;
