import { Spinner } from "@chakra-ui/react";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Modal from "../Components/Modals";
import ScrollToTopOnPageChange from "../Components/ScrollToTop";
import YoutubePlayer from "../Components/YoutubePlayer";
import { apiGetReq } from "../Constant/api-functions";
import UserMainPage from "../Pages/AdminPanel/User";
import { RootState } from "../reducers";
import { closePlayer } from "../reducers/PlayerReducer";
import PlaylistPage from "../Pages/AdminPanel/Playlist";
import AlbumContent from "../Pages/AdminPanel/AlbumContent/AlbumContent";
import Login from "../Pages/Login";
import PrivateRoute from "../Components/PrivateRoute/PrivateRoute";

const AdminPanel = lazy(() => import("../Pages/AdminPanel"));
const Article = lazy(() => import("../Pages/AdminPanel/Article"));
const PropossedArticle = lazy(() => import("../Pages/AdminPanel/PropossedArticle"));
const MaterialContent = lazy(() => import("../Pages/AdminPanel/Materials"));
const Concert = lazy(() => import("../Pages/AdminPanel/Concert"));
const Artist = lazy(() => import("../Pages/AdminPanel/Artist"));
const PartnerLogos = lazy(() => import("../Pages/AdminPanel/Logos"));
const Radio = lazy(() => import("../Pages/AdminPanel/RadioTv"));

interface Tag {
  _id: string;
  name: string;
}

const AppMain: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const playerOpen = useSelector((state: RootState) => state.player.isOpen);
  const selectedLink = useSelector((state: RootState) => state.player.link);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(playerOpen);
  const [type, setPropsType] = useState<boolean>(false);
  const videoId = useSelector((state: RootState) => state.player.videoId);

  const location = useLocation(); // Extract current route
  const isLoginPage = location.pathname === "/login"; // Check if current route is login page

  useEffect(() => {
    setIsOpen(playerOpen);
  }, [playerOpen]);

  useEffect(() => {
    apiGetReq("/tag", {}).then((res) => {
      setTags(res.tags);
    });
  }, []);

  const onClose = () => {
    dispatch(closePlayer());
  };

  return (
    <div className={` ${!themeMode && "back-dark"}`}>
      <Suspense
        fallback={
          <div className="w-screen h-screen flex justify-center items-center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="lg"
            />
          </div>
        }>
        <ScrollToTopOnPageChange />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>

        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <PrivateRoute>
                <Outlet />
              </PrivateRoute>
            }>
              <Route path="" element={<Navigate to="article" />} />
              <Route
                path="article"
                element={<AdminPanel component={<Article tagData={tags} />} />}
              />
              <Route
                path="propossedArticle"
                element={<AdminPanel component={<PropossedArticle tagData={tags} />} />}
              />
              <Route
                path="radio"
                element={<AdminPanel component={<Radio path="tv" tagData={tags} />} />}
              />
              <Route
                path="album"
                element={<AdminPanel component={<AlbumContent />} />}
              />
              <Route
                path="playlist"
                element={<AdminPanel component={<PlaylistPage />} />}
              />
              <Route
                path="concerts"
                element={<AdminPanel component={<Concert />} />}
              />
              <Route
                path="artists"
                element={<AdminPanel component={<Artist />} />}
              />
              <Route
                path="logos"
                element={<AdminPanel component={<PartnerLogos />} />}
              />
              <Route
                path="user"
                element={<AdminPanel component={<UserMainPage user={[]} />} />}
              />
            </Route>
          </Routes>

          {/* YoutubePlayer will only render if NOT on login page */}
          {!isLoginPage && <YoutubePlayer isOpen={isOpen} type={type} />}
        </div>
      </Suspense>

      {/* Optional Modal (commented in your original code) */}
      {/*
      <Modal isOpen={isOpen} onClose={onClose}>
        <YoutubePlayer link={selectedLink} />
      </Modal>
      */}
    </div>
  );
};

export default AppMain;
