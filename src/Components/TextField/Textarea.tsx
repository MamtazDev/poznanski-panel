import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";

interface InputProps {
  onChange?: (value: string) => void;
  label: string;
  value?: string;
  placeholderText?: string;
  type?: boolean;
  rowNum?: number;
}
const Textarea: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholderText,
  type,
  rowNum,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  return (
    <div className="w-full">
      <label
        className={`block mb-2 label-text text-left ${themeMode ? "text-gray-900" : "text-white"}`}
        style={{ fontSize: type ? "14px" : "16px" }}
      >
        {label}
      </label>
      <textarea
        id="message"
        rows={rowNum || 5}
        className={`block w-full border ${themeMode ? "textarea-light" : "textarea-dark"}`}
        placeholder={placeholderText}
        onChange={onChange && ((e) => onChange(e.target.value))}
      >
        {value && value}
      </textarea>
    </div>
  );
};

export default Textarea;
