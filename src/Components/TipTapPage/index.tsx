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
      <NewsPreviewModal isOpen={isOpen} onClose={onClose} article={data} />
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

const NewsPreviewModal = ({ isOpen, onClose, article }: any) => {
  if (!article) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg" // Smaller modal size
      motionPreset="scale"
    >
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

          {/* External Link */}
          {article.link && (
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 text-lg font-medium hover:underline mt-6"
            >
              🔗 Visit Full Article
            </a>
          )}
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
