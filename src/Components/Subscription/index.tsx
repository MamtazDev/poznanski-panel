import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { isValidEmail } from "../../Constant/helpers";
import "./style.css";
import { apiPostReq } from "../../Constant/api-functions";
import { useToast } from "@chakra-ui/react";

const Subscription = () => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [email, setEmail] = useState<string>("");
  const toast = useToast();
  const toastIdRef = useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleClick = () => {
    if (isValidEmail(email)) {
      apiPostReq("/subscribe", { email })
        .then((res) => {
          console.log(res);
          toast({
            title: res.message,
            position: "top-right",
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Server error",
            position: "top-right",
            isClosable: true,
          });
          console.log(err);
        });
      setEmail("");
    } else {
      toast({
        title: `Type your email correctly!`,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  return (
    <div className="md:mt-28 mt-20 flex justify-center">
      <div className="container">
        <div
          className={`flex flex-col md:flex-row  justify-between w-full md:px-5 px-4 md:py-16 py-8 ${!themeMode ? "subscription-body-dark" : "subscription-body"}`}
        >
          <div>
            <div
              className={`subscription-title ${!themeMode && "title-dark-color"} text-left`}
            >
              Subscribe To Our Newsletter
            </div>
            <div className="subscription-text">
              You can upgrade, downgrade, or cancel your subscription anytime.
            </div>
          </div>
          <div className="flex items-center md:w-2/5">
            <div className="flex md:h-12 h-10 w-full mt-8">
              <div
                className={`input-back md:px-6 px-4 md:py-2 py-1 w-4/6 ${!themeMode && "input-back-dark"}`}
              >
                <input
                  className="w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline-none"
                  placeholder="willie.jennings@example.com"
                  value={email}
                  onChange={handleChange}
                ></input>
              </div>
              <div
                className={`subscription-btn cursor-pointer flex justify-center items-center p-3 ${!themeMode && "subscription-btn-dark"}`}
                onClick={handleClick}
              >
                Subscribe Now
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
