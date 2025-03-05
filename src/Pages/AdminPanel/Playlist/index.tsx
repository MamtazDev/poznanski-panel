import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Spinner,
  Box,
  HStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers";
import { apiGetReq, apiPostReq } from "../../../Constant/api-functions";
import CommonButton from "../../../Components/Buttons/CommonButton";
import { openPlayer } from "../../../reducers/PlayerReducer";
import { useDispatch } from "react-redux";

// Pagination Component
const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  // Control how many page numbers are displayed based on screen size
  const maxVisiblePages =
    useBreakpointValue({ base: 3, sm: 5, md: 7, lg: 9 }) || 5;

  // Calculate the range of page numbers to display
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  return (
    <HStack justifyContent="center" spacing={2} mt={5} wrap="wrap">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}>
        Previous
      </Button>

      {startPage > 1 && (
        <>
          <Button variant="outline" onClick={() => onPageChange(1)}>
            1
          </Button>
          {startPage > 2 && <Button isDisabled>...</Button>}
        </>
      )}

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
        <Button
          key={startPage + i}
          variant={currentPage === startPage + i ? "solid" : "outline"}
          onClick={() => onPageChange(startPage + i)}>
          {startPage + i}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <Button isDisabled>...</Button>}
          <Button variant="outline" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </Button>
        </>
      )}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}>
        Next
      </Button>
    </HStack>
  );
};

const PlaylistPage: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isReloadLoading, setIsReloadLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useDispatch();

  const getYouTubeID = (url: string) => {
    let videoId = "";
    try {
      if (url.includes("youtube.com/watch?v=")) {
        videoId = new URL(url).searchParams.get("v") || "";
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
      }
    } catch (error) {
      console.error("Error extracting YouTube ID:", error);
    }
    return videoId;
  };

  const handlePlay = (youTube: any) => {
    if (youTube) {
      const videoId = getYouTubeID(youTube);
      if (youTube) {
        dispatch(openPlayer(youTube));
      }
    }
  };

  const fetchPlaylists = async (page: number) => {
    setLoading(true);
    try {
      const result = await apiGetReq(`/playlist?page=${page}&limit=10`, {});
      setPlaylists(result.data);
      setTotalPages(result.totalPages);
      setCurrentPage(page);
    } catch (error: Error | any) {
      toast({
        title: "Error fetching playlists",
        description: error.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists(currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    if (!search) return fetchPlaylists(1);
    const filtered = playlists.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
    setPlaylists(filtered);
  };

  const handleReload = async () => {
    setIsReloadLoading(true);
    await apiPostReq(`/playlist/reload`, {});
    await fetchPlaylists(currentPage);
    setIsReloadLoading(false);
  };

  const filteredData = playlists.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-3 overflow-y-auto w-full h-full pb-28">
      <div className="flex md:justify-between gap-2">
        <Box
          className={`mb-4 md:w-[300px] w-[276px] ${
            themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
          }`}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Search by title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputRightElement onClick={handleSearch} cursor="pointer">
              <AiOutlineSearch />
            </InputRightElement>
          </InputGroup>
        </Box>
        {/* setIsReloadLoading true to spinner button from chakra ui */}
        <Button
          isLoading={isReloadLoading}
          onClick={() => handleReload()}
          colorScheme="purple"
          disabled={isReloadLoading}>
          Reload Playlist
        </Button>
      </div>

      {loading ? (
        <Box textAlign="center">
          <Spinner size="xl" />
        </Box>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
          <table className="w-full h-full" style={{ minWidth: "400px" }}>
            <thead
              className={`text-xs uppercase ${
                themeMode
                  ? "text-white bg-[#5A1073]"
                  : "bg-[#3bd6c6] text-[#5A1073]"
              }`}>
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Video</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b ${
                      !themeMode
                        ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                        : "bg-white text-gray-900 hover:bg-gray-200"
                    }`}>
                    <td className="p-4 text-left line-clamp-1">{item.title}</td>
                    {/* <td className="px-4 py-3 text-left"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(item?.youTube);
                      }} >
                      <iframe
                        src={
                          item?.youTube?.includes("youtube.com/watch")
                            ? `https://www.youtube.com/embed/${item?.youTube?.split("v=")[1].split("&")[0]
                            }`
                            : item?.youTube ||
                            "https://www.youtube.com/embed/6JYIGclVQdw"
                        }
                        title="YouTube player"
                        className="w-40 h-24 rounded-lg shadow-lg"
                        frameBorder="0"
                      />
                    </td> */}
                    <td className="px-4 py-3">
                      <div
                        className={`relative lg:bg-gray-100 cursor-pointer lg:h-48 rounded-md flex-shrink-0 overflow-hidden ${!themeMode && "dark-bg-color"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlay(item?.videoId);
                        }}>
                        {/* <p>Title: {item?.videoId }</p> */}
                        <img
                          src={
                            item?.videoId
                              ? `https://img.youtube.com/vi/${item?.videoId}/hqdefault.jpg`
                              : "default-thumbnail.jpg"
                          }
                          className="md:w-full w-[69px] h-full object-cover"
                          alt="YouTube Thumbnail"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          {themeMode ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="58"
                              height="57"
                              viewBox="0 0 58 57"
                              fill="none"
                              className="w-[20px] md:w-[58px]">
                              <circle cx="29" cy="28.5" r="28" fill="#5A1073" />
                              <path
                                d="M22.6 17.3L41.8 28.8L22.2 39.6L22.6 17.3Z"
                                fill="white"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="55"
                              height="55"
                              viewBox="0 0 55 55"
                              fill="none"
                              className="w-[20px] md:w-[58px]">
                              <circle
                                cx="27.5"
                                cy="27.5"
                                r="27.5"
                                fill="#2FC4B2"
                              />
                              <path
                                d="M20.8 16L39.3 27.1L20.5 37.5L20.8 16Z"
                                fill="#111217"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-left line-clamp-1">
                      {item.description.slice(0, 50)}
                    </td>
                    {/* <td className="py-4">{item.tags}</td> */}
                    <td className="py-4 text-left">
                      {new Date(item.publishedAt).toISOString().split("T")[0]}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={fetchPlaylists}
      />
    </div>
  );
};

export default PlaylistPage;
