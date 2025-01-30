import {
  Avatar,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import { apiGetReq } from "../../../Constant/api-functions";
import { RootState } from "../../../reducers";

interface Users {
  id: string;
  nickname: string;
  role: string;
  email: string;
  isVerified: boolean;
}

interface UserDataProps {
  user: Users[];
}

const UserMainPage: React.FC<UserDataProps> = () => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>("");
  const [selectedRowsNum, setSelectedRowsNum] = useState<number>(5);
  const [selectedPage, setSelectedPage] = useState<string>("1");
  const [userAllData, setUserAllData] = useState<Users[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<string>("");

  const handleAddArticle = () => {
    setOpenAddModal(true);
  };

  const handleChangeFilterText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const handleEditClick = (userId: string, isVerified: boolean) => {
    setSelectedUserId(userId);
    setVerificationStatus(isVerified ? "Verified" : "Unverified");
    onOpen();
  };

  const handleVerificationChange = (status: string) => {
    setVerificationStatus(status);
  };

  const handleSaveVerification = () => {
    // Debugging logs
    console.log("selectedUserId:", selectedUserId);
    console.log("verificationStatus:", verificationStatus);
    console.log("userAllData before update:", userAllData);

    setUserAllData((prevData) =>
      prevData.map((user) =>
        user.id === selectedUserId
          ? { ...user, isVerified: verificationStatus === "Verified" }
          : user
      )
    );

    // Debugging after the update
    console.log("userAllData after update:", userAllData);

    onClose(); // Close the modal after saving
  };

  useEffect(() => {
    apiGetReq("/auth/users", {
      filter: filterText,
    })
      .then((res) => {
        setUserAllData(res);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [selectedRowsNum, selectedPage, filterText]);

  useEffect(() => {
    console.log("Updated userAllData:", userAllData);
  }, [userAllData]);

  return (
    <div className="p-3 overflow-y-auto w-full h-full pb-28">
      <div className="flex justify-between">
        <div className="mb-4" style={{ width: "300px" }}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Search..."
              backgroundColor="white"
              onChange={handleChangeFilterText}
            />
            <InputRightElement pointerEvents="none">
              <AiOutlineSearch />
            </InputRightElement>
          </InputGroup>
        </div>
      </div>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Image</Th>
              <Th>Title</Th>
              <Th>Role</Th>
              <Th>Email</Th>
              <Th>Is Verified</Th>
            </Tr>
          </Thead>

          <Tbody>
            {userAllData?.map((users: any, index: any) => (
              <Tr key={index}>
                <Td>
                  <img src="" alt={users.nickname} />
                </Td>
                <Td className="capitalize">{users.nickname}</Td>
                <Td className="capitalize">{users.role}</Td>
                <Td>{users.email}</Td>
                <Td>
                  <div className="flex gap-2 items-center">
                    <h2 style={{ color: users.isVerified ? "green" : "red" }}>
                      {users.isVerified ? "Verified" : "Unverified"}
                    </h2>
                    <AiOutlineEdit
                      onClick={() =>
                        handleEditClick(users.id, users.isVerified)
                      }
                    />
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal for editing verification status */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Verification Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup
              onChange={handleVerificationChange}
              value={verificationStatus}
            >
              <Stack direction="column">
                <Radio value="Verified">Verified</Radio>
                <Radio value="Unverified">Unverified</Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>

          <ModalFooter className="space-x-2">
            <Button colorScheme="blue" onClick={handleSaveVerification}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserMainPage;
