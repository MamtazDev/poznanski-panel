import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { apiGetReq } from "../Constant/api-functions";
import { Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import { closePlayer } from "../reducers/PlayerReducer";
import ScrollToTopOnPageChange from "../Components/ScrollToTop";
import YoutubePlayer from "../Components/YoutubePlayer";
import Modal from "../Components/Modals";
import { useDispatch } from "react-redux";
import UserMainPage from "../Pages/AdminPanel/User";
// import UserMainPage from "../Pages/AdminPanel/User";

const AdminPanel = lazy(() => import("../Pages/AdminPanel"));
const Article = lazy(() => import("../Pages/AdminPanel/Article"));
const ProductContent = lazy(() => import("../Pages/AdminPanel/Product"));
const Concert = lazy(() => import("../Pages/AdminPanel/Concert"));
const Artist = lazy(() => import("../Pages/AdminPanel/Artist"));
const PartnerLogos = lazy(() => import("../Pages/AdminPanel/Logos"));
const Radio = lazy(() => import("../Pages/AdminPanel/Radio"));

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

  useEffect(() => {
    setIsOpen(playerOpen);
  }, [playerOpen]);

  useEffect(() => {
    apiGetReq("/tag", {}).then((res) => {
      setTags(res.tags);
    });
  }, []);

  const onClose = () => {
    // setIsOpen(false);
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
        }
      >
        <ScrollToTopOnPageChange />
        <Routes>
          <Route path="" element={<Navigate to="admin" />} />
          <Route path="/admin">
            <Route path="" element={<Navigate to="article" />} />
            <Route
              path="article"
              element={<AdminPanel component={<Article tagData={tags} />} />}
            />
            <Route
              path="radio"
              element={
                <AdminPanel component={<Radio path="tv" tagData={tags} />} />
              }
            />
            <Route
              path="material"
              element={
                <AdminPanel
                  component={<ProductContent path="" tagData={tags} />}
                />
              }
            />
            <Route
              path="concerts"
              element={<AdminPanel component={<Concert tagData={tags} />} />}
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
      </Suspense>
      <Modal isOpen={isOpen} onClose={onClose}>
        <YoutubePlayer link={selectedLink} />
      </Modal>
    </div>
  );
};

export default AppMain;
