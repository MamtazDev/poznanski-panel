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
  content: any[];
  // setContent: (newContent: string) => void;
  setContent: (content: string) => void;
}

export type FileFromEditor = {
  name: string;
  size: number;
  file: Blob;
  url: string;
};

const TipTapPage: React.FC<TipTapProps> = ({ content, setContent }) => {
  const [files, setFiles] = useState<FileFromEditor[] | null>(null);
  const [editorContent, setEditorContent] = useState<string>(
    content[0]?.description || ""
  );

  const editor = useEditor({
    extensions: [StarterKit],
    content: content[0]?.description || "", // Use the parsed content
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html); // Update the content when the editor changes
    },
  });

  useEffect(() => {
    console.log("Editor Content Updated:", editorContent);
  }, [editorContent]);

  return (
    <div className="bg-gray-500 p-4 items-center justify-center text-white text-xl rounded-lg shadow-lg h-[500px]">
      <TipTap
        themeMode={false}
        type={false}
        setArticle={(newContent: string) => {
          setEditorContent(newContent);
          setContent(newContent);
        }}
        setFiles={setFiles}
        content={editorContent}
        editor={editor}
      />
    </div>
  );
};

export default TipTapPage;
