import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";
import { formatDateToMonthDayYear, formatDateToYYYYMMDD } from "../../utils";

interface InputProps {
  onChange?: (value: Object) => void;
  name: string;
  label: string;
  value?: string;
  error?: boolean;
  errMsg?: string;
  type?: boolean;
}

const DatePicker: React.FC<InputProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  errMsg,
  type,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({
        [e.target.name]: formatDateToMonthDayYear(e.target.value),
      });
    }
  };
  return (
    <div className="w-full gap-4 relative">
      <label
        className={`block mb-2 label-text text-left ${
          themeMode ? "text-gray-900" : "text-white"
        } `}
        style={{ fontSize: type ? "14px" : "18px" }}
      >
        {label}
      </label>
      <input
        type="date"
        name={name}
        id={`floating_${name}`}
        value={formatDateToYYYYMMDD(value)}
        onChange={handleChange}
        className={`${themeMode ? "input-light" : "input-dark"} shadow-sm  block w-full ${error ? "border border-red-500 text-red-900 placeholder-red-700" : "border"} `}
        style={{ height: type ? "32px" : "36.825px" }}
        placeholder={error ? errMsg : ""}
        required
      />
    </div>
  );
};

export default DatePicker;
