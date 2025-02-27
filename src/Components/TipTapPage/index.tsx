
import { useState, useEffect } from "react";
import TipTap from "../TipTap/TipTap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Image,
  Badge,
} from "@chakra-ui/react";

interface Content {
  subHead: string;
  img: string;
  description: string;
}

interface TipTapProps {
  content: string;
  setContent: (newContent: string) => void;
  data?: any
  // setContent: (content: string) => void;
}

export type FileFromEditor = {
  name: string;
  size: number;
  file: Blob;
  url: string;
};

const TipTapPage1: React.FC<TipTapProps> = ({ content,data={}, setContent }) => {
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
      <NewsPreviewModal isOpen={isOpen}  onClose={onClose} article={data}  />
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




const NewsPreviewModal = ({ isOpen, onClose, article }:any) => {
  if (!article) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xxl">
      
      <ModalOverlay />
      <ModalContent>
        
        <ModalHeader>
        <Button onClick={onClose} colorScheme="blue" mt={4}>
        Back to Edit
      </Button></ModalHeader>
        <ModalHeader>
          
          {article.title || "Untitled"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {article.files?.length > 0 && (
            <Image
              src={article.files[0]} // Display first image
              alt={article.title}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
          )}

          <p className="text-gray-500 text-sm mb-2">
            {article.nickname} - {new Date(article.date).toLocaleDateString()}
          </p>

          {article.tags && (
            <div className="mb-4">
              {article.tags.split(",").map((tag:any, index:any) => (
                <Badge key={index} colorScheme="blue" mr={2}>
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}

          <p className="text-lg font-semibold mb-2">{article.intro}</p>

          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="p-4 border border-gray-300 rounded-md"
          ></div>

          {article.link && (
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline block mt-4"
            >
              Read more
            </a>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};



