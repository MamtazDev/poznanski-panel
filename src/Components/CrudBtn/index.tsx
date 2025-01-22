import React from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { IconButton } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";

interface CrubBtnProps {
  value: string;
  mode?: boolean;
  onClickEdit: (value: string, mode?: boolean) => void;
  onClickDelete: (value: string, mode?: boolean) => void;
}

const CrudBtn: React.FC<CrubBtnProps> = ({
  value,
  mode,
  onClickEdit,
  onClickDelete,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  return (
    <div>
      <div className="flex gap-2">
        <IconButton
          aria-label="Edit btn"
          variant={themeMode ? "outline" : ""}
          icon={<AiFillEdit />}
          onClick={() => onClickEdit(value, mode)}
        />
        <IconButton
          aria-label="Edit btn"
          variant={themeMode ? "outline" : ""}
          icon={<AiFillDelete />}
          onClick={() => onClickDelete(value, mode)}
        />
      </div>
    </div>
  );
};

export default CrudBtn;
