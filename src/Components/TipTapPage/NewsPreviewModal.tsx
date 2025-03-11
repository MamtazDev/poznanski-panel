import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Image, Badge } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import YoutubePlayer from "../YoutubePlayer";
import { BiArrowBack } from "react-icons/bi";
import { openPlayer } from "../../reducers/PlayerReducer";

const NewsPreviewModal = ({ isOpen, onClose, article, dispatch }: any) => {
  const contentRef = useRef<HTMLDivElement>(null);

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
    onClose();
    if (youTube) {
      const videoId = getYouTubeID(youTube);
      if (videoId) {
        dispatch(openPlayer(videoId));
      }
    }
  };

  useEffect(() => {
    if (!article?.content) {
        return
    };

    const container = contentRef.current;
    if (!container) {
        return};

    const youtubeDivs = container.querySelectorAll<HTMLDivElement>(".editor-youtube");
    console.log("container", youtubeDivs)


    const handleYoutubeClick = (event: Event) => {
      const target = event.currentTarget as HTMLDivElement;
      const videoSrc = target.getAttribute("src");
      const videoId = videoSrc ? videoSrc.split("v=")[1] : null;
      console.log("Clicked YouTube Video ID:", videoId);
    };

    youtubeDivs.forEach((div) => {
      div.addEventListener("click", handleYoutubeClick);
    });

    return () => {
      youtubeDivs.forEach((div) => {
        div.removeEventListener("click", handleYoutubeClick);
      });
    };
  }, [article?.content]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      motionPreset="scale"
    >
      {/* <YoutubePlayer isOpen={isOpen} /> */}
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent className="rounded-lg p-4 shadow-xl" style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <ModalCloseButton color="white" size="lg" top={5} right={6} />

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
          <p onClick={() => handlePlay("https://www.youtube.com/watch?v=eBs3yDYzGHE")}>
            Preview for youtube
          </p>
          <h1 className="text-3xl font-semibold text-white">{article?.title || "Untitled"}</h1>
          <p className="text-lg opacity-70 mt-2 text-white">
            {article?.nickname} · {article?.date ? new Date(article.date).toLocaleDateString() : ""}
          </p>
        </Box>

        <ModalBody className="max-w-full mx-auto p-6 text-black space-y-3 mt-6 ">
          {article?.files?.length > 0 && (
            <Box className="overflow-hidden rounded-lg  mb-4 justify-center items-center flex">
              <Image
                src={article.files[0]}
                alt={article.title}
                className="w-[30%] h-[50%] object-cover rounded-lg shadow-md hover:shadow-xl cursor-pointer"
              />
            </Box>
          )}

          {article?.tags && (
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

          <div className="text-start p-4 rounded-md shadow-md hover:shadow-xl cursor-pointer">
            <p className="text-lg text-gray-700 leading-relaxed">
              {article?.intro}
            </p>
          </div>

          <Box
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: article?.content || "" }}
            className="w-full border border-gray-100 rounded-xl p-4 cursor-pointer mt-6"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NewsPreviewModal;
