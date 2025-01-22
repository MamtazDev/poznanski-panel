import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";

interface InputProps {
  onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  value?: string | number;
  error?: boolean;
  errMsg?: string;
  type?: boolean;
}
const Input: React.FC<InputProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  errMsg,
  type,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  return (
    <div className="w-full gap-4">
      <label
        className={`block mb-2 label-text text-left ${themeMode ? "text-gray-900" : "text-white"} `}
        style={{ fontSize: type ? "14px" : "18px" }}
      >
        {label}
      </label>
      <input
        type="text"
        name={name}
        id="floating_email"
        value={value}
        onChange={onChange && ((e) => onChange(e))}
        className={`${themeMode ? "input-light" : "input-dark"} shadow-sm  block w-full ${error ? "border border-red-500 text-red-900 placeholder-red-700" : "border"} `}
        style={{ height: type ? "32px" : "36.825px" }}
        placeholder={error ? errMsg : ""}
        required
      />
    </div>
  );
};

export default Input;
