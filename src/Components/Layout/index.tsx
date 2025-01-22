import React, { ReactNode } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Subscription from "../Subscription";
import Logo_2 from "../../assets/png/wujo.png";
import "./style.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <NavBar />
      {children}
      <div className="middle-back md:mt-28 mt-12 flex justify-center items-center">
        <div className="md:h-40 h-20">
          <img src={Logo_2} className="h-full w-full" alt="logo-2" />
        </div>
      </div>
      <Subscription />
      <Footer />
    </div>
  );
};

export default Layout;
