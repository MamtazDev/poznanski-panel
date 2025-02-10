import { useState } from "react";
import TipTap from "../TipTap/TipTap";


export type FileFromEditor = {
	name: string;
	size: number;
	file: Blob;
	url: string;
};
function TipTapPage() {
  const [article, setArticle] = useState<string>('');
  const [files, setFiles] = useState<FileFromEditor[] | null>(null);


  return (
    <div className="bg-gray-500 p-4 m-4 h-[400px] flex items-center justify-center text-white text-xl rounded-lg shadow-lg">
      TipTap
      <div>
        <TipTap
          themeMode={false}
          type={false}
          setArticle={setArticle}
          setFiles={setFiles}
        />
      </div>
    </div>
  );
}

export default TipTapPage;
