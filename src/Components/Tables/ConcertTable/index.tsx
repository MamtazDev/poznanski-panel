// import React, { useEffect, useState } from "react";
// import { Image, Select, Spinner } from "@chakra-ui/react";
// import FolderImage from "../../../assets/png/folder_icon.png";
// import CrudBtn from "../../CrudBtn";
// import PaginationBar from "../../PaginationBar";
// import axios from "axios";
// import "./style.css";

// interface Concert {
//   id: string;
//   name: string;
//   img: string;
//   category: string;
//   location: string;
//   link: string;
//   description: string;
//   timeframe: {
//     start: string;
//     end: string;
//   };
// }

// const ConcertTable: React.FC = () => {
//   const [concerts, setConcerts] = useState<Concert[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [themeMode, setThemeMode] = useState<boolean>(true);
//   const [selectedPage, setSelectedPage] = useState<number>(1);
//   const [rowsPerPage, setRowsPerPage] = useState<number>(5);
//   const [totalPages, setTotalPages] = useState<number>(1);

//   useEffect(() => {
//     fetchConcerts();
//   }, [selectedPage, rowsPerPage]);

//   const fetchConcerts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`/concert?page=${selectedPage}&limit=${rowsPerPage}`);
//       setConcerts(response.data.concerts);
//       setTotalPages(response.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching concerts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (id: string) => {
//     console.log("Edit concert:", id);
//     // Implement edit logic
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await axios.delete(`/concert/${id}`);
//       fetchConcerts();
//     } catch (error) {
//       console.error("Error deleting concert:", error);
//     }
//   };

//   return (
//     <div>
//       <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
//         <table className="w-full h-full min-w-[400px]">
//           <thead className={`text-xs uppercase ${themeMode ? "text-gray-700 bg-gray-400" : "bg-gray-700 text-gray-400"}`}>
//             <tr>
//               <th className="px-6 py-3">Image</th>
//               <th className="px-6 py-3">Title</th>
//               <th className="px-6 py-3">Category</th>
//               <th className="px-6 py-3">Location</th>
//               <th className="px-6 py-3">Link</th>
//               <th className="px-6 py-3">Description</th>
//               <th className="px-6 py-3">Start</th>
//               <th className="px-6 py-3">End</th>
//               <th className="px-6 py-3">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={9} className="text-center py-10">
//                   <Spinner size="xl" />
//                 </td>
//               </tr>
//             ) : concerts.length ? (
//               concerts.map((concert) => (
//                 <tr key={concert.id} className={themeMode ? "bg-white text-gray-900" : "bg-gray-800 text-gray-200"}>
//                   <td className="text-center">
//                     <Image boxSize="100px" objectFit="contain" alt="No Image" src={concert.img || FolderImage} />
//                   </td>
//                   <td>{concert.name}</td>
//                   <td>{concert.category}</td>
//                   <td>{concert.location}</td>
//                   <td>
//                     <a href={concert.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                       View
//                     </a>
//                   </td>
//                   <td className="table-description">{concert.description}</td>
//                   <td>{concert.timeframe.start}</td>
//                   <td>{concert.timeframe.end}</td>
//                   <td className="text-center">
//                     {/* <CrudBtn onClickEdit={() => handleEdit(concert.id)} onClickDelete={() => handleDelete(concert.id)} /> */}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={9} className="text-center py-10 text-gray-500">No concerts available</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       <div className="flex mt-3 justify-end gap-2">
//         <span className={`flex items-center gap-2 ${themeMode ? "text-gray-700" : "text-gray-100"}`}>Rows per page:</span>
//         <Select
//           backgroundColor={themeMode ? "" : "#242526"}
//           color={themeMode ? "#252733" : "#FFF"}
//           border={themeMode ? "1px solid #E9EBF0" : "unset"}
//           height="30"
//           width={"80px"}
//           value={rowsPerPage}
//           onChange={(e) => setRowsPerPage(Number(e.target.value))}
//         >
//           {[5, 10, 15].map((num) => (
//             <option key={num} value={num} style={{ color: themeMode ? "black" : "white", backgroundColor: themeMode ? "white" : "#242526" }}>
//               {num}
//             </option>
//           ))}
//         </Select>
//         {/* <PaginationBar selectedPage={selectedPage} setSelectedPage={setSelectedPage} pages={totalPages} /> */}
//       </div>
//     </div>
//   );
// };

// export default ConcertTable;
