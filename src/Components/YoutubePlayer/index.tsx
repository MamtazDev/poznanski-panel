import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";

interface PlayerProps {
  link: string;
}

const YoutubePlayer: React.FC<PlayerProps> = ({ link }) => {
  const [mute, setMute] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string>("");
  const [playerWidth, setPlayerWidth] = useState<string>("450px");
  const [playerHeight, setPlayerHeight] = useState<string>("253px");
  const [dataLink, setDataLink] = useState<string>(link);

  useEffect(() => {
    console.log("input Link:", link);
    const regExp =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(regExp);
    if (match) {
      setVideoId(match[4]);
    } else {
      setVideoId("1RFiFjG7Eh4");
    }
  }, [link]);

  const opts = {
    height: playerHeight,
    width: playerWidth,
    playerVars: {
      // autoplay: 1,
    },
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPlayerHeight("200px");
        setPlayerWidth("355px");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const _onReady = (event: { target: any }) => {
    console.log("test");
    event.target.pauseVideo();
  };
  return (
    <div>
      <YouTube
        videoId={videoId}
        // id={videoId}
        onPlay={() => {
          console.log("test");
        }}
        opts={opts}
        onReady={(event) => {
          event.target.pauseVideo();
        }}
      />
    </div>
  );
};

export default YoutubePlayer;
