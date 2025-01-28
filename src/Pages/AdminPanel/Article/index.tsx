import React, { useEffect, useState } from "react";
import { fileUrl } from "../../../Constant/config";
import {
  apiDeleteReq,
  apiGetReq,
  apiPutReq,
  apiPostReq,
} from "../../../Constant/api-functions";
import {
  InputGroup,
  InputRightElement,
  Input,
  Image,
  Select,
} from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
import CrudBtn from "../../../Components/CrudBtn";
import PaginationBar from "../../../Components/PaginationBar";
import ConfirmModal from "../../../Components/Modals/ConfirmModal";
import EditModal from "../../../Components/Modals/AticleEditModal";
import CommonButton from "../../../Components/Buttons/CommonButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import "../style.css";
import staticImg from '../../../assets/png/defaultimg.png'

interface News {
  id: string;
  title: string;
  feature: string;
  tags?: any
  date: string;
  files?: string[];
  content: Content[];
  link: string;
}
interface inputNews {
  tag: string;
  _id: string;
  title: string;
  feature: string;
  tags?: any;
  date: string;
  content: Content[];
  link: string;
}

interface Tag {
  _id: string;
  name: any;
}

interface ArticleProps {
  tagData: {
    _id: string;
    name: string;
  }[];
}

interface Content {
  subHead: string;
  img: string;
  description: string;
}
export const getFirstTag = (tags: string) => {
  return tags.split("#")[0];
};
interface NewsDataAll {
  news: News[];  // Assuming the `news` property holds the actual news data.
}
const Article: React.FC<ArticleProps> = ({ tagData }) => {
  const [cardData, setCardData] = useState<News[]>([]);
  const [newsDataAll, setNewsDataAll] = useState<NewsDataAll | null>(null);

  // Then, access it like this:
  const fetchNesAllData = newsDataAll?.news || [];
  console.log(fetchNesAllData, "fetchNesAllData")
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [selectedPage, setSelectedPage] = useState<string>("1");
  const [selectedRowsNum, setSelectedRowsNum] = useState<number>(5);
  const [filterText, setFilterText] = useState<string>("");
  const [pageNum, setPageNum] = useState<string>("1");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [tags, setTags] = React.useState<Tag[]>([]);

  const [modalData, setModalData] = useState<News>({
    id: "",
    title: "",
    feature: "",
    date: "",
    content: [
      {
        subHead: "",
        img: "",
        description: "",
      },
    ],
    link: "",
  });
  const handleData = (response: any) => {
    let newsData: News[] = [];
    const pages = Math.ceil(response.all / selectedRowsNum);
    setPageNum(pages.toString());

    response.news.forEach((item: inputNews) => {
      const inputDate: Date = new Date(item.date);
      const formattedDate: string = inputDate.toLocaleDateString("en-US", {
        year: "numeric",
        day: "numeric",
        month: "long",
      });

      // Parse the content and tags
      let newsContent: Content[] = item.content.map((i: Content) => ({
        subHead: i.subHead,
        img: fileUrl + i.img,
        description: i.description,
      }));

      const temp: News = {
        id: item._id,
        title: item.title,
        feature: item.tag ?? "",
        tags: item.tag
          ? item.tag.split(",").map((tag, index) => ({
            _id: `${item._id}-${index}`,
            name: tag.trim(),
          }))
          : [],
        content: newsContent,
        date: formattedDate,
        link: item.link,
      };
      newsData.push(temp);
    });
    setCardData(newsData);
  };

  useEffect(() => {
    apiGetReq("/news/all", {
      rowsPerPage: selectedRowsNum,
      curPage: selectedPage,
      filter: filterText,

    }).then((res) => {
      // handleData(res);
      setNewsDataAll(res)
    });
  }, []);


  useEffect(() => {
    apiGetReq("/news/all", {
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

  const handleAddArticle = () => {
    setModalData({
      id: "",
      title: "",
      feature: "",
      date: "",
      content: [
        {
          subHead: "",
          img: "",
          description: "",
        },
      ],
      link: "",
    });
    setOpenAddModal(true);
  };

  const handleEdit = (id: string | undefined) => {
    if (!id) {
      console.error("Edit clicked: ID is undefined");
      return;
    }

    const selectedData = cardData.find((item) => item.id === id);
    console.log(selectedData);  // Log selected data

    if (selectedData) {
      setModalData(selectedData);
      setOpenEditModal(true);
    } else {
      console.error(`Item with id ${id} not found in cardData`);
    }
  };


  const handleDelete = (id: string) => {
    setModalData(cardData.filter((item) => item.id === id)[0]);
    setOpenDeleteModal(true);
  };

  const handleEditNews = () => {
    apiPutReq("/news/all", { ...modalData, ...modalData.content[0] }).then((res) => {
      console.log(res);

      const inputDate: Date = new Date(res.data.date);
      const options: object = {
        year: "numeric",
        day: "numeric",
        month: "long",
      };
      const formattedDate: string = inputDate.toLocaleDateString(
        "en-US",
        options
      );
      if (res.success) {
        setCardData((prevState) =>
          prevState.map((item) =>
            item.id === res.data._id
              ? {
                ...item,
                title: res.data.title,
                feature: res.data.tag,
                date: formattedDate,
                img: modalData.content[0].img,
                link: res.data.link,
                description: res.data.description,
              }
              : item
          )
        );
      }
    });
    setOpenEditModal(false);
  };

  const handleAddData = () => {
    apiPostReq("/news/all", modalData).then((res) => {
      console.log(res);

      const inputDate: Date = new Date(res.data.date);
      const options: object = {
        year: "numeric",
        day: "numeric",
        month: "long",
      };
      const formattedDate: string = inputDate.toLocaleDateString(
        "en-US",
        options
      );
      if (res.success) {
        setCardData((prevState) => [
          ...prevState,
          {
            id: res.data._id,
            title: res.data.title,
            feature: res.data.tag,
            date: formattedDate,
            content: res.data.content,
            link: res.data.link,
          },
        ]);
      }
    });
    setOpenAddModal(false);
  };

  // const handleDeleteNews = () => {
  //   console.log("deleting:", modalData);
  //   apiDeleteReq("/news/all", { id: modalData.id }).then((res) => {
  //     if (res.success) {
  //       if (res.deleted) {
  //         setCardData((prevState) =>
  //           prevState.filter((item) => item.id !== modalData.id)
  //         );
  //       } else {
  //         console.log("No match that news!");
  //       }
  //     } else {
  //       console.log("server error!");
  //     }
  //   });
  //   setOpenDeleteModal(false);
  // };

  const handleDeleteNews = async () => {
    try {
      const res = await apiDeleteReq("/news/all", { id: modalData.id });
      if (res.success && res.deleted) {
        setCardData((prevState) =>
          prevState.filter((item) => item.id !== modalData.id)
        );
      } else {
        console.error("Error deleting article:", res.message);
      }
    } catch (error) {
      console.error("Server error:", error);
    }
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
        <CommonButton text="Add article" onClick={handleAddArticle} />
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full h-full" style={{ minWidth: "400px" }}>
          <thead
            className={`text-xs uppercase ${themeMode ? " text-gray-700  bg-gray-400" : "bg-gray-700 text-gray-400"}`}
          >
            <tr>
              <th className="px-6 py-3" style={{ width: "130px" }}>
                Image
              </th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3 w-28">Tag</th>
              <th className="px-6 py-3 w-32">Date</th>
              <th className="px-6 py-3 w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {fetchNesAllData?.map((item: News, index: number) => {
              // console.log(item.tags, "itemsdkfjdkfjd")
              return (
                <tr key={index}
                  className={`border-b py-3  ${!themeMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white text-gray-900"}`}>
                  <td className="flex justify-center mt-3">
                    <img src={item?.files?.[0] || staticImg} alt={item?.title || "Image related to article"}  className="rounded-full w-[100px] h-[100px]"/>
                  </td>
                  <td style={{ width: "200px" }}>{item.title}</td>
                  <td style={{ width: "200px" }}>
                        {item?.tags?.split(',')}
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <div className="flex justify-center">
                      <CrudBtn
                        onClickEdit={() => handleEdit(item.id)}
                        value={item.id}
                        onClickDelete={() => handleDelete(item.id)}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="flex mt-3 justify-end gap-2">
        <div
          className={`flex items-center gap-2 ${themeMode ? " text-gray-700" : "text-gray-100"}`}
        >
          Rows per page:
        </div>
        <Select
          backgroundColor={themeMode ? "" : "#242526"}
          color={themeMode ? "#252733" : "#FFF"}
          border={themeMode ? "1px solid #E9EBF0" : "unset"}
          height="30"
          width={"80px"}
          onChange={handleChange}
        >
          <option
            style={{
              color: themeMode ? "black" : "white",
              backgroundColor: themeMode ? "white" : "#242526",
            }}
            value="5"
          >
            5
          </option>
          <option
            style={{
              color: themeMode ? "black" : "white",
              backgroundColor: themeMode ? "white" : "#242526",
            }}
            value="10"
          >
            10
          </option>
          <option
            style={{
              color: themeMode ? "black" : "white",
              backgroundColor: themeMode ? "white" : "#242526",
            }}
            value="15"
          >
            15
          </option>
        </Select>
        <PaginationBar
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          pages={pageNum}
        />
      </div>
      <ConfirmModal
        isOpen={openDeleteModal}
        setIsOpen={setOpenDeleteModal}
        handleOk={handleDeleteNews}
        text="Are you sure you want to delete this News?"
      />

      <EditModal
        isOpen={openEditModal}
        setIsOpen={setOpenEditModal}
        handleOk={handleEditNews}
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

export default Article;
