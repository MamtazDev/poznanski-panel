import React from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { IconButton } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

interface CrudBtnProps {
  value: string;
  mode?: boolean;
  onClickEdit: (value: string, mode?: boolean) => void;
  onClickDelete: (value: string, mode?: boolean) => void;
}

const CrudBtn: React.FC<CrudBtnProps> = ({
  value,
  mode,
  onClickEdit,
  onClickDelete,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  return (
    <div className="crud-btn">
      <div className="flex gap-2">
        <IconButton
          aria-label="Edit button"
          variant={themeMode ? "outline" : "solid"}
          icon={<FaRegEdit />}
          onClick={() => {
            console.log("Edit clicked:", value, mode);
            onClickEdit(value, mode);
          }}
        />
        <IconButton
          aria-label="Delete button"
          variant={themeMode ? "outline" : "solid"}
          icon={ <RiDeleteBin6Line />}
          onClick={() => {
            console.log("Delete clicked:", value, mode);
            onClickDelete(value, mode);
          }}
        />
      </div>
    </div>
  );
};

export default CrudBtn;
