import React, { useEffect, useState } from "react";
import { fileUrl } from "../../../Constant/config";
import {
  apiDeleteReq,
  apiGetReq,
  apiPutReq,
  apiPostReq,
} from "../../../Constant/api-functions";
import { InputGroup, InputRightElement, Input } from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
import ConfirmModal from "../../../Components/Modals/ConfirmModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import ProductTable from "../../../Components/Tables/ConcertTable";
import EditModal from "../../../Components/Modals/ConcertModal";
import CommonButton from "../../../Components/Buttons/CommonButton";
import "../style.css";

interface Product {
  id: string;
  name: string;
  img: string;
  category: string;
  timeframe: {
    start: string;
    end: string;
  };
  link: string;
  location: string;
  description: string;
}
interface inputProducts {
  _id: string;
  name: string;
  img: string;
  category: string;
  timeframe: {
    start: string | Date;
    end: string | Date;
  };
  link: string;
  location: string;
  description: string;
}

interface Tag {
  _id: string;
  name: string;
}

interface ConcertProps {
  tagData: {
    _id: string;
    name: string;
  }[];
}

const ProductContent: React.FC<ConcertProps> = ({ tagData }) => {
  const [cardData, setCardData] = useState<Product[]>([]);
  const [modalData, setModalData] = useState<Product>({
    id: "",
    name: "",
    img: "",
    category: "",
    timeframe: {
      start: "",
      end: "",
    },
    link: "",
    location: "",
    description: "",
  });
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [selectedPage, setSelectedPage] = useState<string>("1");
  const [selectedRowsNum, setSelectedRowsNum] = useState<number>(5);
  const [filterText, setFilterText] = useState<string>("");
  const [pageNum, setPageNum] = useState<string>("1");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [tags, setTags] = React.useState<Tag[]>([]);

  const handleData = (response: any) => {
    let newProducts: Product[] = [];
    const pages = Math.ceil(response.all / selectedRowsNum);
    setPageNum(pages.toString());
    response.products.map((item: inputProducts) => {
      const inputStartDate: Date = new Date(item.timeframe.start);
      const inputEndDate: Date = new Date(item.timeframe.end);
      const options: object = {
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
      };
      const formattedStartDateTime = new Intl.DateTimeFormat(
        "en-US",
        options
      ).format(inputStartDate);
      const formattedEndDateTime = new Intl.DateTimeFormat(
        "en-US",
        options
      ).format(inputEndDate);
      const temp: Product = {
        id: item._id,
        name: item.name,
        img: fileUrl + item.img,
        category: item.category,
        timeframe: {
          start: formattedStartDateTime,
          end: formattedEndDateTime,
        },
        link: item.link,
        location: item.location,
        description: item.description,
      };
      newProducts.push(temp);
    });
    setCardData(newProducts);
  };

  useEffect(() => {
    setTags(tagData);
  }, [tagData]);

  useEffect(() => {
    apiGetReq(`/concert`, {
      rowsPerPage: selectedRowsNum,
      curPage: selectedPage,
      filter: filterText,
    }).then((res) => {
      handleData(res);
    });
  }, []);

  useEffect(() => {
    apiGetReq(`/concert`, {
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

  const handleAddConcert = () => {
    setModalData({
      id: "",
      name: "",
      img: "",
      category: "",
      timeframe: {
        start: "",
        end: "",
      },
      link: "",
      location: "",
      description: "",
    });
    setOpenAddModal(true);
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
    apiPutReq("/concert", modalData).then((res) => {
      const inputStartDate: Date = new Date(res.data.timeframe.start);
      const inputEndDate: Date = new Date(res.data.timeframe.end);
      const options: object = {
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
      };
      const formattedStartDateTime = new Intl.DateTimeFormat(
        "en-US",
        options
      ).format(inputStartDate);
      const formattedEndDateTime = new Intl.DateTimeFormat(
        "en-US",
        options
      ).format(inputEndDate);

      if (res.success) {
        setCardData((prevState) =>
          prevState.map((item) =>
            item.id === res.data._id
              ? {
                  ...item,
                  name: res.data.name,
                  category: res.data.category,
                  timeframe: {
                    start: formattedStartDateTime,
                    end: formattedEndDateTime,
                  },
                  img: modalData.img,
                  link: res.data.link,
                  location: res.data.location,
                  description: res.data.description,
                }
              : item
          )
        );
      }
    });
    console.log(cardData);
    setOpenEditModal(false);
  };

  const handleAddData = () => {
    apiPostReq("/concert", modalData).then((res) => {
      console.log(res.data);
      const inputStartDate: Date = new Date(res.data.timeframe.start);
      const inputEndDate: Date = new Date(res.data.timeframe.end);
      const options: object = {
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
      };
      const formattedStartDateTime = new Intl.DateTimeFormat(
        "en-US",
        options
      ).format(inputStartDate);
      const formattedEndDateTime = new Intl.DateTimeFormat(
        "en-US",
        options
      ).format(inputEndDate);

      if (res.success) {
        setCardData((prevState) => [
          ...prevState,
          {
            id: res.data._id,
            name: res.data.name,
            category: res.data.category,
            timeframe: {
              start: formattedStartDateTime,
              end: formattedEndDateTime,
            },
            img: modalData.img,
            link: res.data.link,
            location: res.data.location,
            description: res.data.description,
          },
        ]);
      }
    });
    setOpenAddModal(false);
  };

  const handleDeleteData = () => {
    console.log("deleting:", modalData);
    apiDeleteReq("/concert", { id: modalData.id }).then((res) => {
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
              onBlur={handleChangeFilterText}
            />
            <InputRightElement pointerEvents="none">
              <AiOutlineSearch />
            </InputRightElement>
          </InputGroup>
        </div>
        <CommonButton text="Add article" onClick={handleAddConcert} />
      </div>

      <ProductTable
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
        text="Are you sure you want to delete this Concert?"
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

export default ProductContent;
