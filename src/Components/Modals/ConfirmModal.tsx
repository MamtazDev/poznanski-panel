import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  handleOk: () => void;
}

const ConfirmModal: React.FC<ModalProps> = ({
  isOpen,
  text,
  handleOk,
  setIsOpen,
}) => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor={themeMode ? "#E9E9EB" : "#242526"}>
          <div className="mt-10">
            <svg
              className={`mx-auto mb-4  w-12 h-12 ${themeMode ? "text-gray-400" : "text-gray-50"}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <ModalBody>
            <div className={`${themeMode ? "text-gray-700" : "text-gray-50"}`}>
              {text}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              No, cancel
            </Button>
            <Button
              variant="ghost"
              color={themeMode ? "black" : "white"}
              onClick={handleOk}
            >
              Yes, I'm sure
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
