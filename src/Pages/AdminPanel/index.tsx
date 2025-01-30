import React, { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "./Layout";
import Menu from "./menu";

interface AdminPanelProps {
  component: ReactNode;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ component }) => {
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState<string>("");

  useEffect(() => {
    if (location.pathname.includes("article")) {
      setSelectedMenu("article");
    } else if (location.pathname.includes("material")) {
      setSelectedMenu("material");
    } else if (location.pathname.includes("concerts")) {
      setSelectedMenu("concerts");
    } else if (location.pathname.includes("artists")) {
      setSelectedMenu("artists");
    } else if (location.pathname.includes("logos")) {
      setSelectedMenu("logos");
    }
  }, [location.pathname]);

  return (
    <div className="h-screen">
      <AdminLayout
        component={
          <Menu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
        }
      >
        {component}
      </AdminLayout>
    </div>
  );
};

export default AdminPanel;
