import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import CommonButton from "../../../Components/Buttons/CommonButton";
import ConfirmModal from "../../../Components/Modals/ConfirmModal";
import EditModal from "../../../Components/Modals/ProductEditModal";
import ProductTable from "../../../Components/Tables/RadioTv";
import {
  apiDeleteReq,
  apiGetReq,
  apiPostReq,
  apiPutReq,
} from "../../../Constant/api-functions";
import { fileUrl } from "../../../Constant/config";
import { RootState } from "../../../reducers";
import "../style.css";

interface Product {
  id: string;
  title: string;
  img: string;
  category: string;
  date: string;
  link: string;
  location: string;
  artist: string;
  star: number;
}

interface inputProducts {
  _id: string;
  title: string;
  img: string;
  category: string;
  date: string | Date;
  link: string;
  location: string;
  artist: string;
  star: number;
}

interface Tag {
  _id: string;
  name: string;
}

interface ProductContentProps {
  path: string;
  tagData: {
    _id: string;
    name: string;
  }[];
}

const RadioContent: React.FC<ProductContentProps> = ({ path, tagData }) => {
  const [cardData, setCardData] = useState<Product[]>([]);
  const [modalData, setModalData] = useState<Product>({
    id: "",
    title: "",
    img: "",
    category: "",
    date: "",
    link: "",
    location: "",
    artist: "",
    star: 0,
  });
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [selectedPage, setSelectedPage] = useState<string>("1");
  const [selectedRowsNum, setSelectedRowsNum] = useState<number>(5);
  const [filterText, setFilterText] = useState<string>("");
  const [pageNum, setPageNum] = useState<string>("1");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [tags, setTags] = React.useState<Tag[]>([]);

  useEffect(() => {
    setTags(tagData);
  }, [tagData]);

  const handleData = (response: any) => {
    let newProducts: Product[] = [];
    const pages = Math.ceil(response.all / selectedRowsNum);
    setPageNum(pages.toString());
    response.products.map((item: inputProducts) => {
      const inputDate: Date = new Date(item.date);
      const options: object = {
        year: "numeric",
        day: "numeric",
        month: "long",
      };
      const formattedDate: string = inputDate.toLocaleDateString(
        "en-US",
        options,
      );
      const temp: Product = {
        id: item._id,
        title: item.title,
        img: fileUrl + item.img,
        category: item.category,
        date: formattedDate,
        link: item.link,
        location: item.location,
        artist: item.artist,
        star: item.star,
      };
      newProducts.push(temp);
    });
    setCardData(newProducts);
  };

  useEffect(() => {
    apiGetReq(`/product${path !== "" ? `/${path}` : ""}/`, {
      rowsPerPage: selectedRowsNum,
      curPage: selectedPage,
      filter: filterText,
    }).then((res) => {
      handleData(res);
    });
  }, []);

  useEffect(() => {
    apiGetReq(`/product${path !== "" ? `/${path}` : ""}/`, {
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
    // console.log("edit:", id);
    setModalData(cardData.filter((item) => item.id === id)[0]);
    setOpenEditModal(true);
  };

  const handleDelete = (id: string) => {
    setModalData(cardData.filter((item) => item.id === id)[0]);
    setOpenDeleteModal(true);
  };

  const handleEditData = () => {
    // console.log(modalData);
    apiPutReq("/product", modalData).then((res) => {
      // console.log(res);

      const inputDate: Date = new Date(res.data.date);
      const options: object = {
        year: "numeric",
        day: "numeric",
        month: "long",
      };
      const formattedDate: string = inputDate.toLocaleDateString(
        "en-US",
        options,
      );
      if (res.success) {
        setCardData((prevState) =>
          prevState.map((item) =>
            item.id === res.data._id
              ? {
                  ...item,
                  title: res.data.title,
                  category: res.data.category,
                  date: formattedDate,
                  img: modalData.img,
                  link: res.data.link,
                  location: res.data.location,
                  artist: res.data.artist,
                  star: res.data.star,
                }
              : item,
          ),
        );
      }
    });
    // console.log(cardData);
    setOpenEditModal(false);
  };

  const handleAddData = () => {
    apiPostReq("/product", modalData).then((res) => {
      // console.log(res);

      const inputDate: Date = new Date(res.data.date);
      const options: object = {
        year: "numeric",
        day: "numeric",
        month: "long",
      };
      const formattedDate: string = inputDate.toLocaleDateString(
        "en-US",
        options,
      );
      if (res.success) {
        setCardData((prevState) => [
          ...prevState,
          {
            id: res.data._id,
            title: res.data.title,
            category: res.data.category,
            date: formattedDate,
            img: modalData.img,
            link: res.data.link,
            location: res.data.location,
            artist: res.data.artist,
            star: res.data.star,
          },
        ]);
      }
    });
    setOpenAddModal(false);
  };

  const handleDeleteData = () => {
    // console.log("deleting:", modalData);
    apiDeleteReq("/product", { id: modalData.id }).then((res) => {
      if (res.success) {
        if (res.deleted) {
          setCardData((prevState) =>
            prevState.filter((item) => item.id !== modalData.id),
          );
        } else {
          // console.log("No match that news!");
        }
      } else {
        // console.log("server error!");
      }
    });
    setOpenDeleteModal(false);
  };

  const handleAdd = () => {
    setModalData({
      id: "",
      title: "",
      img: "",
      category: "",
      date: "",
      link: "",
      location: "",
      artist: "",
      star: 0,
    });
    setOpenAddModal(true);
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
        <CommonButton text="Add New" onClick={handleAdd} />
      </div>
      {/* <ProductTable
        themeMode={themeMode}
        cardData={cardData}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleChange={handleChange}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        pageNum={pageNum}
      /> */}

      <ConfirmModal
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        handleOk={handleDeleteData}
        text="Are you sure you want to delete this?"
      />
      <EditModal
        isOpen={openEditModal}
        setIsOpen={setOpenEditModal}
        handleOk={handleEditData}
        data={modalData}
        setData={setModalData}
        tags={tags}
        setTags={setTags}
      />
      <EditModal
        isOpen={openAddModal}
        setIsOpen={setOpenAddModal}
        handleOk={handleAddData}
        data={modalData}
        setData={setModalData}
        tags={tags}
        setTags={setTags}
      />
    </div>
  );
};

export default RadioContent;
