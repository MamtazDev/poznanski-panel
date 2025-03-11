import { useState, useEffect } from "react";
import TipTap, { FileFromEditor } from "../TipTap/TipTap";
import { Box, Button, Image, Badge } from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi";

interface TipTapProps {
  content: string;
  setContent: (newContent: string) => void;
  isPreview: boolean;
  setIsPreview: (show: boolean) => void;
  data?: any;
}

const TipTapPage1: React.FC<TipTapProps> = ({
  content,
  data = {},
  isPreview,
  setIsPreview,
  setContent,
}) => {
  const [article, setArticle] = useState<string>(content);
  const [files, setFiles] = useState<FileFromEditor[] | null>(null);

  // Sync content with article state whenever content changes
  useEffect(() => {
    setArticle(content);
  }, [content]);

  return (
    <>
      {!isPreview ? (
        <div className="bg-gray-500 p-4 text-white text-xl rounded-lg shadow-lg h-[555px]">
          <TipTap
            content={article}  // Pass article instead of content
            setArticle={setArticle}
            setFiles={setFiles}
          />
          <Button onClick={() => setIsPreview(true)} colorScheme="blue" mt={4}>
            Preview
          </Button>
        </div>
      ) : (
        <NewsPreview
          article={{ ...data, content: article }}
          onBack={() => setIsPreview(false)}
        />
      )}
    </>
  );
};

export default TipTapPage1;

const NewsPreview = ({
  article,
  onBack,
}: {
  article: any;
  onBack: () => void;
}) => {
  return (
    <Box className="w-full py-4 px-4 rounded-lg shadow-2xl bg-[#2d2b2e]">
      <Button
        onClick={onBack}
        colorScheme="whiteAlpha"
        variant="ghost"
        leftIcon={<BiArrowBack />}
        size="sm"
        className="mb-4">
        Back to Edit
      </Button>
      <h1 className="text-3xl font-semibold text-white">
        {article?.title || "Untitled"}
      </h1>
      <p className="text-lg opacity-70 mb-4 text-white">
        {article?.nickname} ·{" "}
        {article?.date ? new Date(article.date).toLocaleDateString() : ""}
      </p>

      {article?.files?.length > 0 && (
        <Box className="overflow-hidden w-[150px] h-[150px] mb-4 rounded-lg">
          <Image
            src={article.files[0]}
            alt={article.title}
            className="object-cover shadow-md hover:shadow-xl cursor-pointer"
          />
        </Box>
      )}

      {article?.tags && (
        <div className="flex flex-wrap gap-3 mb-4">
          {article.tags.split(",").map((tag: string, index: number) => (
            <Badge
              key={index}
              colorScheme="blue"
              variant="solid"
              px={3}
              py={1}
              fontSize="sm"
              borderRadius="full">
              #{tag.trim()}
            </Badge>
          ))}
        </div>
      )}

      <Box
        dangerouslySetInnerHTML={{ __html: article?.content || article }}
        className="w-full border border-gray-100 rounded-xl p-4 cursor-pointer mt-6 bg-white text-black"
      />
    </Box>
  );
};
