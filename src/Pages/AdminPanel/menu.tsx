import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiCircle } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { logoutRequest } from "../../Constant/api-functions";
import { useToast } from "@chakra-ui/react";

const mainMenu = [
  { icon: <BiCircle />, text: "Article", link: "article" },
  { icon: <BiCircle />, text: "Propossed Article", link: "propossedArticle" },
  { icon: <BiCircle />, text: "TV/Radio", link: "radio" },
  // { icon: <BiCircle />, text: "Material", link: "material" },
  { icon: <BiCircle />, text: "Album", link: "album" },
  {icon: <BiCircle />, text: "Playlist", link: "playlist", },
  { icon: <BiCircle />, text: "Concerts", link: "concerts" },
  { icon: <BiCircle />, text: "Artists", link: "artists" },
  { icon: <BiCircle />, text: "User", link: "user" },

];

const Menu = () => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [selectedMenu, setSelectedMenu] = useState(
    sessionStorage.getItem("selectedMenu") || "article"
  );
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutRequest();
    navigate("/login");
  };
  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    setSelectedMenu(currentPath || "article"); // Default to "article"
  }, [location]);

  useEffect(() => {
    sessionStorage.setItem("selectedMenu", selectedMenu);
  }, [selectedMenu]);

  return (
    <div className="flex flex-col gap-1 w-full px-5">
      {mainMenu.map((item, idx) => (
        <Link key={idx} to={`/admin/${item.link}`}>
          <div
            className={`flex gap-3 justify-start items-center w-full cursor-pointer p-2.5 side-menu
              ${selectedMenu === item.link ? "side-menu-selected" : ""}
              ${!themeMode ? "side-menu-dark" : ""}`}
            onClick={() => setSelectedMenu(item.link)}>
            {item.icon}
            <div>{item.text}</div>
          </div>
        </Link>
      ))}
      <button className="bg-red-300 p-2 rounded" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Menu;




// function Logout() {

//   const [isLoading, setIsLoading] = useState(false);
//   const toast = useToast();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     setIsLoading(true);
//     try {
//         const = await logoutRequest();

//         // Check for "User not authenticated" message
//         if (message === "User not authenticated") {
//             toast({
//                 title: 'Not authenticated',
//                 description: 'You are not logged in.',
//                 status: 'warning',
//                 duration: 5000,
//                 isClosable: true,
//             });
//             return; // Do not proceed with redirect
//         }

//         // If logout is successful and no authentication issues
//         toast({
//             title: 'Logout successful',
//             description: 'You have been logged out.',
//             status: 'success',
//             duration: 5000,
//             isClosable: true,
//         });
//         navigate('/login');
//     } catch (error) {
//         toast({
//             title: 'Logout failed',
//             description: 'An error occurred while logging out.',
//             status: 'error',
//             duration: 5000,
//             isClosable: true,
//         });
//     } finally {
//         setIsLoading(false);
//     }
// };

// const logoutWithFetch = async()=> {
//   try {
//     const response = await fetch('http://localhost:8000/api/auth/logout', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include',
//     });

//     if (!response.ok) {
//       throw new Error(`Logout failed with status: ${response.status}`);
//     }

//     const responseData = await response.json();

//     navigate('/login');
//     return responseData;



//   } catch (error) {
//     toast({
//       title: 'Logout failed',
//       description: 'An error occurred while logging out.',
//       status: 'error',
//       duration: 5000,
//       isClosable: true,
//   });  }
// }


//   return (
//     <div onClick={logoutWithFetch}>Logout</div>
//   )
// }
