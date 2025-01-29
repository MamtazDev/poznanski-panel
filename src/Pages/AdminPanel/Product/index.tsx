// import { Input, InputGroup, InputRightElement, Select } from "@chakra-ui/react";
// import React, { useEffect, useState } from "react";
// import { AiOutlineSearch } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import useSWR from 'swr';
// import CommonButton from "../../../Components/Buttons/CommonButton";
// import ConfirmModal from "../../../Components/Modals/ConfirmModal";
// import EditModal from "../../../Components/Modals/ProductEditModal";
// import {
//   apiDeleteReq,
//   apiGetReq,
//   apiPostReq,
//   apiPutReq,
// } from "../../../Constant/api-functions";
// import { fileUrl } from "../../../Constant/config";
// import { RootState } from "../../../reducers";
// import { openPlayer } from "../../../reducers/PlayerReducer";
// import "../style.css";
// interface Product {
//   id: string;
//   title: string;
//   img: string;
//   category: string;
//   date: string;
//   link: string;
//   location: string;
//   artist: string;
//   star: number;
// }
// type Material = {
//   id: number;
//   _id: string;
//   title: string;
//   youTube: string;
//   img: string;
//   description: string;
//   date: string | Date;
//   link: string;
//   tags: string;
//   location: string;
//   artist: string;
//   star: number;
//   updatedAt?: string; // Optional or required based on API
// };
// interface inputProducts {
//   _id: string;
//   title: string;
//   img: string;
//   category: string;
//   date: string | Date;
//   location: string;
//   artist: string;
//   star: number;
// }
// interface Tag {
//   _id: string;
//   name: string;
// }

// interface ProductContentProps {
//   path: string;
//   tagData: {
//     _id: string;
//     name: string;
//   }[];
// }

// const ProductContent: React.FC<ProductContentProps> = ({ path, tagData }) => {
//   const [cardData, setCardData] = useState<Product[]>([]);
//   const [modalData, setModalData] = useState<Product>({
//     id: "",
//     title: "",
//     img: "",
//     category: "",
//     date: "",
//     link: "",
//     location: "",
//     artist: "",
//     star: 0,
//   });
//   const themeMode = useSelector((state: RootState) => state.themeMode.mode);
//   const [selectedPage, setSelectedPage] = useState<string>("1");
//   const [selectedRowsNum, setSelectedRowsNum] = useState<number>(5);
//   const [filterText, setFilterText] = useState<string>("");
//   const [pageNum, setPageNum] = useState<string>("1");
//   const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
//   const [openEditModal, setOpenEditModal] = useState<boolean>(false);
//   const [openAddModal, setOpenAddModal] = useState<boolean>(false);
//   const [tags, setTags] = React.useState<Tag[]>([]);

//   useEffect(() => {
//     setTags(tagData);
//   }, [tagData]);

//   const handleData = (response: any) => {
//     let newProducts: Product[] = [];
//     const pages = Math.ceil(response.all / selectedRowsNum);
//     setPageNum(pages.toString());
//     response.products.map((item: inputProducts) => {
//       const inputDate: Date = new Date(item.date);
//       const options: object = {
//         year: "numeric",
//         day: "numeric",
//         month: "long",
//       };
//       const formattedDate: string = inputDate.toLocaleDateString(
//         "en-US",
//         options
//       );
//       const temp: Product = {
//         id: item._id,
//         title: item.title,
//         img: fileUrl + item.img,
//         category: item.category,
//         date: formattedDate,
//         link: item.link,
//         location: item.location,
//         artist: item.artist,
//         star: item.star,
//       };
//       newProducts.push(temp);
//     });
//     setCardData(newProducts);
//   };

//   useEffect(() => {
//     apiGetReq(`/product${path !== "" ? `/${path}` : ""}/`, {
//       rowsPerPage: selectedRowsNum,
//       curPage: selectedPage,
//       filter: filterText,
//     }).then((res) => {
//       handleData(res);
//     });
//   }, []);

//   useEffect(() => {
//     apiGetReq(`/product${path !== "" ? `/${path}` : ""}/`, {
//       rowsPerPage: selectedRowsNum,
//       curPage: selectedPage,
//       filter: filterText,
//     }).then((res) => {
//       handleData(res);
//     });
//   }, [selectedPage, selectedRowsNum, filterText]);

//   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedRowsNum(parseInt(e.target.value));
//   };

//   const handleChangeFilterText = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFilterText(e.target.value);
//   };

//   const handleEdit = (id: string) => {
//     console.log("edit:", id);
//     setModalData(cardData.filter((item) => item.id === id)[0]);
//     setOpenEditModal(true);
//   };

//   const handleDelete = (id: string) => {
//     setModalData(cardData.filter((item) => item.id === id)[0]);
//     setOpenDeleteModal(true);
//   };

//   const handleEditData = () => {
//     console.log(modalData);
//     apiPutReq("/product", modalData).then((res) => {
//       console.log(res);

//       const inputDate: Date = new Date(res.data.date);
//       const options: object = {
//         year: "numeric",
//         day: "numeric",
//         month: "long",
//       };
//       const formattedDate: string = inputDate.toLocaleDateString(
//         "en-US",
//         options
//       );
//       if (res.success) {
//         setCardData((prevState) =>
//           prevState.map((item) =>
//             item.id === res.data._id
//               ? {
//                 ...item,
//                 title: res.data.title,
//                 category: res.data.category,
//                 date: formattedDate,
//                 img: modalData.img,
//                 link: res.data.link,
//                 location: res.data.location,
//                 artist: res.data.artist,
//                 star: res.data.star,
//               }
//               : item
//           )
//         );
//       }
//     });
//     console.log(cardData);
//     setOpenEditModal(false);
//   };

//   const handleAddData = () => {
//     apiPostReq("/product", modalData).then((res) => {
//       console.log(res);

//       const inputDate: Date = new Date(res.data.date);
//       const options: object = {
//         year: "numeric",
//         day: "numeric",
//         month: "long",
//       };
//       const formattedDate: string = inputDate.toLocaleDateString(
//         "en-US",
//         options
//       );
//       if (res.success) {
//         setCardData((prevState) => [
//           ...prevState,
//           {
//             id: res.data._id,
//             title: res.data.title,
//             category: res.data.category,
//             date: formattedDate,
//             img: modalData.img,
//             link: res.data.link,
//             location: res.data.location,
//             artist: res.data.artist,
//             star: res.data.star,
//           },
//         ]);
//       }
//     });
//     setOpenAddModal(false);
//   };

//   const handleDeleteData = () => {
//     console.log("deleting:", modalData);
//     apiDeleteReq("/product", { id: modalData.id }).then((res) => {
//       if (res.success) {
//         if (res.deleted) {
//           setCardData((prevState) =>
//             prevState.filter((item) => item.id !== modalData.id)
//           );
//         } else {
//           console.log("No match that news!");
//         }
//       } else {
//         console.log("server error!");
//       }
//     });
//     setOpenDeleteModal(false);
//   };

//   const handleAdd = () => {
//     setModalData({
//       id: "",
//       title: "",
//       img: "",
//       category: "",
//       date: "",
//       link: "",
//       location: "",
//       artist: "",
//       star: 0,
//     });
//     setOpenAddModal(true);
//   };

//   // dihan
//   const dispatch = useDispatch();
//   const handlePlay = (link: string) => {
//     console.log(link);
//     dispatch(openPlayer(link));
//   };

//   // create a function to fetch from api
//   // set data to a useState
//   type MaterialsResponse = {
//     materials: Material[];
//   };
//   const urlEndpoint = "http://localhost:8000/api/materials";
//   const fetcher = (url: string): Promise<MaterialsResponse> =>
//     fetch(url).then((res) => res.json());

//   const { data, error } = useSWR<MaterialsResponse>(urlEndpoint, fetcher);
//   const [materials, setMaterials] = useState<Material[]>([]);

//   useEffect(() => {
//     if (data && data.materials) {
//       setMaterials(data.materials);
//     }
//   }, [data]);

//   // Handle loading and error states
//   if (error) return <div>Error loading data.</div>;
//   if (!data) return <div>Loading...</div>;
//   // const wordArray = tags ? data?.materials?.tags.split(",").map((word: string) => word.trim()) : [];
//   console.log("material data", data.materials)

//   return (
//     <div className="p-3 overflow-y-auto w-full h-full pb-28">
//       <div className="flex justify-between">
//         <div className="mb-4" style={{ width: "300px" }}>
//           <InputGroup>
//             <Input
//               type="text"
//               placeholder="Search..."
//               backgroundColor="white"
//               onChange={handleChangeFilterText}
//             />
//             <InputRightElement pointerEvents="none">
//               <AiOutlineSearch />
//             </InputRightElement>
//           </InputGroup>
//         </div>
//         <CommonButton text="Add New" onClick={handleAdd} />
//       </div>
//       {/* <ProductTable
//         themeMode={themeMode}
//         cardData={data?.materials}
//         handleEdit={handleEdit}
//         handleDelete={handleDelete}
//         handleChange={handleChange}
//         selectedPage={selectedPage}
//         setSelectedPage={setSelectedPage}
//         pageNum={pageNum}
//       /> */}
//       <div>
//         <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
//           <table className="h-full w-full" >
//             <thead
//               className={`text-xs uppercase ${themeMode ? " text-gray-700  bg-gray-400" : "bg-gray-700 text-gray-400"}`}
//             >
//               <tr>
//                 <th className="px-6 py-3">
//                   Image
//                 </th>
//                 <th className="px-6 py-3">Title</th>
//                 <th className="px-6 py-3 w-28">Description</th>
//                 <th className="px-6 py-3 w-28">Tag</th>
//                 <th className="px-6 py-3 w-28">Location</th>
//                 <th className="px-6 py-3 w-32">Updated date</th>
//                 <th className="px-6 py-3 w-32">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {materials
//                 .filter((material) =>
//                   material.title.toLowerCase().includes(filterText.toLowerCase())
//                 )
//                 .map((material) => (
//                   <tr key={material._id} className="w-full">
//                     <td className="px-4 py-2 border">
//                       <iframe
//                         height="315"
//                         src={material.youTube}
//                         title={material.title}
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                         allowFullScreen
//                       ></iframe>
//                     </td>
//                     <td className="px-4 py-2 border">{material?.title}</td>
//                     <td className="px-4 py-2 border ">{material.description}</td>
//                     <td className="px-4 py-2 border">
//                       <div className="flex justify-center mt-4 w-full">
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           {material?.tags?.split(',')}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-2 border">
//                       {new Date(material.date).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-2 border">
//                       {material.updatedAt}
//                     </td>
//                     <td className="px-4 py-2 border">
//                       <button
//                         className="text-blue-500 hover:underline"
//                         onClick={() => handleEdit(material._id)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="text-red-500 hover:underline ml-2"
//                         onClick={() => handleDelete(material._id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="flex mt-3 justify-end gap-2">
//           <div
//             className={`flex items-center gap-2 ${themeMode ? " text-gray-700" : "text-gray-100"}`}
//           >
//             Rows per page:
//           </div>
//           <Select
//             backgroundColor={themeMode ? "" : "#242526"}
//             color={themeMode ? "#252733" : "#FFF"}
//             border={themeMode ? "1px solid #E9EBF0" : "unset"}
//             height="30"
//             width={"80px"}
//             onChange={handleChange}
//           >
//             <option
//               style={{
//                 color: themeMode ? "black" : "white",
//                 backgroundColor: themeMode ? "white" : "#242526",
//               }}
//               value="5"
//             >
//               5
//             </option>
//             <option
//               style={{
//                 color: themeMode ? "black" : "white",
//                 backgroundColor: themeMode ? "white" : "#242526",
//               }}
//               value="10"
//             >
//               10
//             </option>
//             <option
//               style={{
//                 color: themeMode ? "black" : "white",
//                 backgroundColor: themeMode ? "white" : "#242526",
//               }}
//               value="15"
//             >
//               15
//             </option>
//           </Select>
//           {/* <PaginationBar
//           selectedPage={selectedPage}
//           setSelectedPage={setSelectedPage}
//           pages={pageNum}
//         /> */}
//         </div>
//       </div>

//       <ConfirmModal
//         isOpen={openDeleteModal}
//         setIsOpen={setOpenDeleteModal}
//         handleOk={handleDeleteData}
//         text="Are you sure you want to delete this?"
//       />
//       <EditModal
//         isOpen={openEditModal}
//         setIsOpen={setOpenEditModal}
//         handleOk={handleEditData}
//         data={modalData}
//         setData={setModalData}
//         tags={tags}
//         setTags={setTags}
//       />
//       <EditModal
//         isOpen={openAddModal}
//         setIsOpen={setOpenAddModal}
//         handleOk={handleAddData}
//         data={modalData}
//         setData={setModalData}
//         tags={tags}
//         setTags={setTags}
//       />
//     </div>
//   );
// };

// export default ProductContent;


import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import CommonButton from "../../../Components/Buttons/CommonButton";
import EditModal from "../../../Components/Modals/ConcertModal";
import ConfirmModal from "../../../Components/Modals/ConfirmModal";
import ProductTable from "../../../Components/Tables/ConcertTable";
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
  const [materials, setMaterialsData] = useState<Product[]>([])
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
    apiGetReq(`/materials`, {
      rowsPerPage: selectedRowsNum,
      curPage: selectedPage,
      filter: filterText,
    }).then((res) => {
      handleData(res);
    });
  }, []);

  useEffect(() => {
    apiGetReq(`/materials`, {
      rowsPerPage: selectedRowsNum,
      curPage: selectedPage,
      filter: filterText,
    }).then((res) => {
      // handleData(res);
      setMaterialsData(res)
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
    apiPutReq("/materials", modalData).then((res) => {
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
    apiPostReq("/materials", modalData).then((res) => {
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
    apiDeleteReq("/materials", { id: modalData.id }).then((res) => {
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

  console.log(materials, "materialsmaterialsmaterialsmaterials")

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
