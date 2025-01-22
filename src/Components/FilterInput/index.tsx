import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "./style.css";

interface FilterInputProps {
  type?: boolean;
}

const FilterInput: React.FC<FilterInputProps> = ({ type }) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  return (
    <>
      <div className="w-full">
        <div
          className={`${!themeMode ? "filter-box-dark-2" : "filter-box-2 "} ${type ? "filter-box-mobile-2" : "filter-box-web-2"} flex place-items-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={type ? "18" : "26"}
            height={type ? "18" : "26"}
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              d="M12.8334 4.5835H18.3334"
              stroke="#BBBCC0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.8334 7.3335H15.5834"
              stroke="#BBBCC0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.25 10.5418C19.25 15.3543 15.3542 19.2502 10.5417 19.2502C5.72921 19.2502 1.83337 15.3543 1.83337 10.5418C1.83337 5.72933 5.72921 1.8335 10.5417 1.8335"
              stroke="#BBBCC0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.1667 20.1668L18.3334 18.3335"
              stroke="#BBBCC0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            className="ml-2.5 ml-peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline-none"
            placeholder="Search Anything"
          ></input>
          <div
            className={`w-0 border h-full`}
            style={{
              borderColor: themeMode
                ? "var(--Base-base-100, #BBBCC0) !important"
                : "var(--Base-base-300, #6D6E76) !important",
            }}
          />
          <div className={`md:ml-6 ml-4`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={!type ? "27" : "19"}
              height={!type ? "26" : "18"}
              viewBox="0 0 27 26"
              fill="none"
            >
              <path
                d="M24.333 7.04199H17.833"
                stroke="#6D6E76"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.00033 7.04199H2.66699"
                stroke="#6D6E76"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.3337 10.8333C13.4277 10.8333 15.1253 9.13575 15.1253 7.04167C15.1253 4.94759 13.4277 3.25 11.3337 3.25C9.23958 3.25 7.54199 4.94759 7.54199 7.04167C7.54199 9.13575 9.23958 10.8333 11.3337 10.8333Z"
                stroke="#6D6E76"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24.3333 18.958H20"
                stroke="#6D6E76"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.16699 18.958H2.66699"
                stroke="#6D6E76"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.6667 22.7503C17.7607 22.7503 19.4583 21.0527 19.4583 18.9587C19.4583 16.8646 17.7607 15.167 15.6667 15.167C13.5726 15.167 11.875 16.8646 11.875 18.9587C11.875 21.0527 13.5726 22.7503 15.6667 22.7503Z"
                stroke="#6D6E76"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterInput;
