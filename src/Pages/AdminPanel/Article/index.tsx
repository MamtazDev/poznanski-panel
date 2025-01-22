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

interface News {
  id: string;
  title: string;
  feature: string;
  date: string;
  content: Content[];
  link: string;
}
interface inputNews {
  _id: string;
  title: string;
  tag: string;
  date: string;
  content: Content[];
  link: string;
}

interface Tag {
  _id: string;
  name: string;
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

const Article: React.FC<ArticleProps> = ({ tagData }) => {
  const [cardData, setCardData] = useState<News[]>([]);
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
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [selectedPage, setSelectedPage] = useState<string>("1");
  const [selectedRowsNum, setSelectedRowsNum] = useState<number>(5);
  const [filterText, setFilterText] = useState<string>("");
  const [pageNum, setPageNum] = useState<string>("1");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [tags, setTags] = React.useState<Tag[]>([]);

  const handleData = (response: any) => {
    let newsData: News[] = [];
    const pages = Math.ceil(response.all / selectedRowsNum);
    setPageNum(pages.toString());
    response.news.map((item: inputNews) => {
      const inputDate: Date = new Date(item.date);
      const options: object = {
        year: "numeric",
        day: "numeric",
        month: "long",
      };
      const formattedDate: string = inputDate.toLocaleDateString(
        "en-US",
        options
      );
      let newsContent: Content[] = [];
      item.content.map((i: Content) => {
        newsContent.push({
          subHead: i.subHead,
          img: fileUrl + i.img,
          description: i.description,
        });
      });
      const temp: News = {
        id: item._id,
        title: item.title,
        feature: item.tag,
        content: newsContent,
        date: formattedDate,
        link: item.link,
      };
      newsData.push(temp);
    });
    setCardData(newsData);
  };

  useEffect(() => {
    setTags(tagData);
  }, [tagData]);

  useEffect(() => {
    apiGetReq("/news", {
      rowsPerPage: selectedRowsNum,
      curPage: selectedPage,
      filter: filterText,
    }).then((res) => {
      handleData(res);
    });
  }, []);

  useEffect(() => {
    apiGetReq("/news", {
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

  const handleEdit = (id: string) => {
    setModalData(cardData.filter((item) => item.id === id)[0]);
    setOpenEditModal(true);
  };

  const handleDelete = (id: string) => {
    setModalData(cardData.filter((item) => item.id === id)[0]);
    setOpenDeleteModal(true);
  };

  const handleEditNews = () => {
    apiPutReq("/news", {...modalData, ...modalData.content[0]}).then((res) => {
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
    apiPostReq("/news", modalData).then((res) => {
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

  const handleDeleteNews = () => {
    console.log("deleting:", modalData);
    apiDeleteReq("/news", { id: modalData.id }).then((res) => {
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
            {cardData?.length ? (
              cardData.map((item, idx) => (
                <tr
                  key={`article-table-${idx}`}
                  className={`border-b ${!themeMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white text-gray-900"}`}
                >
                  <td>
                    <div className="flex justify-center">
                      <Image
                        boxSize="100px"
                        objectFit="contain"
                        alt="Image"
                        src={item.content[0].img.toString()}
                      />
                    </div>
                  </td>
                  <td style={{ width: "200px" }}>{item.title}</td>
                  <td>{item.feature}</td>
                  <td>{item.date}</td>
                  <td>
                    <div className="flex justify-center">
                      <CrudBtn
                        onClickEdit={handleEdit}
                        onClickDelete={handleDelete}
                        value={item.id}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="relative" style={{ height: "400px" }}>
                <div className="absolute top-1/2 left-1/2 w-32 -translate-x-1/2 -translate-y-1/2">
                  <svg
                    className="svg-icon"
                    // style={{width: "1.5302734375em", height: "1em", vertical-align: "middle", fill: "currentColor", overflow: "hidden"}}
                    viewBox="0 0 1567 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M156.662278 699.758173h21.097186A10.444152 10.444152 0 0 1 187.994733 710.202325c0 5.765172-4.490985 10.444152-10.235269 10.444152H156.662278v21.097186A10.444152 10.444152 0 0 1 146.218126 751.978932a10.277045 10.277045 0 0 1-10.444152-10.235269V720.646477H114.676787A10.444152 10.444152 0 0 1 104.441518 710.202325c0-5.765172 4.490985-10.444152 10.235269-10.444152H135.773974v-21.097187A10.444152 10.444152 0 0 1 146.218126 668.425717c5.765172 0 10.444152 4.490985 10.444152 10.235269v21.097187z m1378.628042-83.553215v-21.097186A10.277045 10.277045 0 0 0 1524.846168 584.872503a10.444152 10.444152 0 0 0-10.444152 10.235269v21.097186h-21.097186a10.277045 10.277045 0 0 0-10.235269 10.444152c0 5.598065 4.595427 10.444152 10.235269 10.444152h21.097186v21.097187c0 5.744284 4.67898 10.235269 10.444152 10.235268a10.444152 10.444152 0 0 0 10.444152-10.235268V637.093262h21.097187c5.744284 0 10.235269-4.67898 10.235268-10.444152a10.444152 10.444152 0 0 0-10.235268-10.444152H1535.29032zM776.460024 960.861969H250.596979A20.80475 20.80475 0 0 1 229.77134 939.973665c0-11.530344 9.462402-20.888304 20.825639-20.888303h94.728457A83.010119 83.010119 0 0 1 334.212859 877.413196v-605.96969A83.49055 83.49055 0 0 1 417.849627 187.994733H480.430984V167.001988A83.49055 83.49055 0 0 1 564.067752 83.553215h501.152182A83.448773 83.448773 0 0 1 1148.856702 167.001988v605.969689c0 15.185797-4.052331 29.410732-11.133466 41.672166h115.554096c11.551232 0 20.909192 9.274407 20.909192 20.888304 0 11.530344-9.295295 20.888304-20.888304 20.888304H1002.638576v20.992745c0 15.185797-4.052331 29.410732-11.133466 41.672166h11.196131c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304h-109.893365c9.545955 16.000441 7.478013 36.972297-6.41271 50.863019a41.672166 41.672166 0 0 1-59.072122 0L776.460024 960.861969z m76.367638-41.776607h66.424806c22.977134 0 41.609501-18.59059 41.609501-41.881049V270.461756c0-22.559368-18.047494-40.690416-40.314426-40.690416H416.303892c-22.266932 0-40.314426 18.214601-40.314426 40.690416v606.742557c0 23.123352 18.799473 41.881049 41.588613 41.881049h317.084449l-10.736588-10.757477a41.693054 41.693054 0 0 1-10.861918-40.377091l-19.718558-19.739447A146.259902 146.259902 0 0 1 502.363703 627.693525a146.218126 146.218126 0 0 1 220.517822 190.981761l19.739447 19.739447a41.630389 41.630389 0 0 1 40.377091 10.841029L852.827662 919.085362zM1002.638576 814.643843h62.852906A41.797496 41.797496 0 0 0 1107.080095 772.867236V167.106429c0-23.14424-18.632367-41.776607-41.588613-41.776607H563.775316A41.797496 41.797496 0 0 0 522.207592 167.106429v20.888304h396.794216A83.448773 83.448773 0 0 1 1002.638576 271.443506V814.643843zM266.325872 46.998683h31.123572c8.773088 0 15.875111 6.955805 15.875111 15.666228 0 8.647758-7.102023 15.666228-15.875111 15.666228h-31.123572v31.123572c0 8.773088-6.955805 15.875111-15.666228 15.875111a15.770669 15.770669 0 0 1-15.666228-15.875111V78.331139H203.869844A15.728893 15.728893 0 0 1 187.994733 62.664911c0-8.647758 7.102023-15.666228 15.875111-15.666228h31.123572V15.875111c0-8.773088 6.955805-15.875111 15.666228-15.875111 8.647758 0 15.666228 7.102023 15.666228 15.875111v31.123572zM20.888304 939.973665c0-11.530344 9.462402-20.888304 20.825638-20.888303h125.455152c11.488567 0 20.825639 9.274407 20.825639 20.888303 0 11.530344-9.462402 20.888304-20.825639 20.888304H41.713942A20.80475 20.80475 0 0 1 20.888304 939.973665z m658.733544-135.021995a104.441518 104.441518 0 1 0-147.722083-147.722083 104.441518 104.441518 0 0 0 147.722083 147.722083zM459.542681 313.324555a20.888304 20.888304 0 0 1 20.867415-20.888304H710.202325a20.888304 20.888304 0 1 1 0 41.776608H480.430984A20.825639 20.825639 0 0 1 459.542681 313.324555z m0 104.441518c0-11.530344 9.295295-20.888304 20.742085-20.888303h334.505295c11.44679 0 20.742086 9.274407 20.742086 20.888303 0 11.530344-9.295295 20.888304-20.742086 20.888304H480.284766A20.762974 20.762974 0 0 1 459.542681 417.766073z m0 104.441519c0-11.530344 9.316183-20.888304 20.846527-20.888304h146.301679c11.509455 0 20.846527 9.274407 20.846527 20.888304 0 11.530344-9.316183 20.888304-20.846527 20.888303h-146.301679A20.80475 20.80475 0 0 1 459.542681 522.207592zM62.664911 396.87777a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911zM1357.739739 271.547948a62.664911 62.664911 0 1 1 0-125.329822 62.664911 62.664911 0 0 1 0 125.329822z m0-31.332456a31.332456 31.332456 0 1 0 0-62.664911 31.332456 31.332456 0 0 0 0 62.664911z"
                      fill="#8A96A3"
                    />
                  </svg>
                </div>
              </tr>
            )}
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
