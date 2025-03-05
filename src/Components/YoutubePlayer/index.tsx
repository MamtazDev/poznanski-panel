import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import YouTube from 'react-youtube';
import YoutubeSilverButton from '../../assets/png/silver-yt.png';
import { RootState } from '../../reducers';
import { closePlayer, openPlayer } from '../../reducers/PlayerReducer';

interface PlayerProps {
  isOpen: boolean;
  type?: boolean;
}

const YoutubePlayer: React.FC<PlayerProps> = ({ isOpen, type }) => {
  const videoId = useSelector((state: RootState) => state.player.videoId);
  const dispatch = useDispatch();

  const opts = {
    height: 'auto',
    width: 'auto',
    playerVars: {
      autoplay: 1,
    },
    iframeClass: 'rounded-lg',
  };

  const onClose = () => {
    dispatch(closePlayer());
  };

  const onOpen = () => {
    dispatch(openPlayer(videoId));
  };

  const onReady = (event: any) => {
    const iframe = event.target.getIframe();
    if (iframe && iframe.src) {
      // Replace the iframe source URL for privacy
      const src = iframe.src.replace('www.youtube.com', 'www.youtube-nocookie.com');
      iframe.src = src || "";

      setTimeout(() => {
        event.target.playVideo();
      }, 500);
    }
  };

  return (
    <div
      className={`fixed z-50 flex bottom-2 right-2 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-80'} duration-500 ease-in-out`}
    >
      {videoId && (
        <button
          onClick={!isOpen ? onClose : onOpen}
          className={`${type ? '' : isOpen ? 'mx-2' : 'mx-4'} my-auto z-50 items-center`}
        >
          <img
            className={`w-[120px] rounded-full shadow-2xl transition-all duration-500 ease-in-out ${isOpen ? 'rotate-360' : 'rotate-0'}`}
            src={YoutubeSilverButton}
            alt="YouTube Button"
          />
        </button>
      )}
      {videoId && (
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          iframeClassName="rounded-lg"
        />
      )}
    </div>
  );
};

export default YoutubePlayer;
