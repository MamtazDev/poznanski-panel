import { useState, useEffect } from "react";
import TipTap from "../TipTap/TipTap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Avatar,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { Image, Badge } from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { openPlayer } from "../../reducers/PlayerReducer";
import YoutubePlayer from "../YoutubePlayer";

interface Content {
  subHead: string;
  img: string;
  description: string;
}

interface TipTapProps {
  content: string;
  setContent: (newContent: string) => void;
  data?: any;
  // setContent: (content: string) => void;
}

export type FileFromEditor = {
  name: string;
  size: number;
  file: Blob;
  url: string;
};

const TipTapPage1: React.FC<TipTapProps> = ({
  content,
  data = {},
  setContent,
}) => {
  // console.log("content", content);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [files, setFiles] = useState<FileFromEditor[] | null>(null);
  const [editorContent, setEditorContent] = useState<string>(content || "");
    const dispatch = useDispatch();



  // const editor = useEditor({
  //   extensions: [StarterKit],
  //   content,
  //   onUpdate: ({ editor }) => {
  //     console.log("From created Editor page:",editor)
  //     const html = editor.getHTML();
  //     setContent(html);
  //   },
  // });

  useEffect(() => {
    // console.log("Editor Content:", content);
  }, [content]);

  const [article, setArticle] = useState<string>(content);

  useEffect(() => {
    console.log("article", data);
    setContent(article);
  }, [article]);
  return (
    <div className="bg-gray-500 p-4 items-center justify-center text-white text-xl rounded-lg shadow-lg h-[555px]">
      <TipTap content={content} setArticle={setArticle} setFiles={setFiles} />
      <Button onClick={onOpen} colorScheme="blue" mt={4}>
        Preview
      </Button>


      {/* Preview Modal */}
      <NewsPreviewModal dispatch={dispatch} isOpen={isOpen} onClose={onClose} article={data} />
      {/* <Modal isOpen={isOpen} onClose={onClose} size="xxl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preview Content</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div
              dangerouslySetInnerHTML={{ __html: article }}
              className="p-4 border border-gray-300 rounded-md"></div>
          </ModalBody>
        </ModalContent>
      </Modal> */}
    </div>
  );
};

export default TipTapPage1;

const NewsPreviewModal = ({ isOpen, onClose, article, dispatch }: any) => {
  if (!article) return null;

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
    onClose()
    if (youTube) {
      const videoId = getYouTubeID(youTube);
      if (videoId) {
        dispatch(openPlayer(videoId));
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg" // Smaller modal size
      motionPreset="scale"
    >
      {/* <YoutubePlayer isOpen={isOpen} /> */}
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent className="rounded-lg p-4 shadow-xl" style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <ModalCloseButton
          color="white"
          size="lg"
          top={5}
          right={6}
        />

        {/* Updated Header */}
        <Box className={`w-full py-4 px-4 rounded-lg  shadow-2xl bg-[#2d2b2e]`}>
          <Button
            onClick={onClose}
            colorScheme="whiteAlpha"
            variant="ghost"
            leftIcon={<BiArrowBack />}
            size="sm"
            className="mb-4"
          >
            Back to Edit
          </Button>
          <p onClick={() => handlePlay("https://www.youtube.com/watch?v=8KGhxWjfgIE")}>Preview for youtube</p>
          <h1 className="text-3xl font-semibold text-white">{article.title || "Untitled"}</h1>
          <p className="text-lg opacity-70 mt-2 text-white">
            {article.nickname} · {new Date(article.date).toLocaleDateString()}
          </p>
        </Box>

        {/* Body Content */}
        <ModalBody className="max-w-full mx-auto p-6 text-black space-y-3 mt-6 ">
          {/* Image Section */}
          {article.files?.length > 0 && (
            <Box className="overflow-hidden rounded-lg  mb-4 justify-center items-center flex">
              <Image
                src={article.files[0]}
                alt={article.title}
                className="w-[30%] h-[50%] object-cover rounded-lg shadow-md hover:shadow-xl cursor-pointer"
              />
            </Box>
          )}

          {/* Tags */}
          {article.tags && (
            <div className="flex flex-wrap gap-3 mb-4 justify-center items-center cursor-pointer">
              {article.tags.split(",").map((tag: string, index: number) => (
                <Badge
                  key={index}
                  colorScheme="blue"
                  variant="solid"
                  px={3}
                  py={1}
                  fontSize="sm"
                  borderRadius="full"
                >
                  #{tag.trim()}
                </Badge>
              ))}
            </div>
          )}

          {/* Introduction */}
          <div className="text-start p-4 rounded-md shadow-md hover:shadow-xl cursor-pointer">
          <p className="text-lg text-gray-700 leading-relaxed">
            {article.intro}
          </p>
          </div>

          {/* Main Content */}
          <Box
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="w-full border border-gray-100 rounded-xl p-4 cursor-pointer mt-6"
          />
        </ModalBody>

        {/* Footer */}
        {/* <Box className="w-full p-4 border-t flex justify-center bg-gray-100 rounded-lg">
          <Button onClick={onClose} size="lg" colorScheme="blue" px={8}>
            Close
          </Button>
        </Box> */}
      </ModalContent>
    </Modal>
  );
};
