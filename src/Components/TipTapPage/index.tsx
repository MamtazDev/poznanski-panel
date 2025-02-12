import { useState, useEffect } from "react";
import TipTap from "../TipTap/TipTap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Content {
  subHead: string;
  img: string;
  description: string;
}

interface TipTapProps {
  content: string;
  setContent: (newContent: string) => void;
  // setContent: (content: string) => void;
}

export type FileFromEditor = {
  name: string;
  size: number;
  file: Blob;
  url: string;
};

const TipTapPage1: React.FC<TipTapProps> = ({ content, setContent }) => {
  console.log("content", content )
  const [files, setFiles] = useState<FileFromEditor[] | null>(null);
  const [editorContent, setEditorContent] = useState<string>(
    content || ""
  );

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
    console.log("Editor Content:", content);
  }, [content]);

  const [article, setArticle] = useState<string>(content);

  useEffect(() => {
    console.log("article", article);
    setContent(article)
  }, [article]);

  return (
    <div className="bg-gray-500 p-4 items-center justify-center text-white text-xl rounded-lg shadow-lg h-[500px]">
      <TipTap content={content} setArticle={setArticle} setFiles={setFiles} />
    </div>
  );
};

export default TipTapPage1;
