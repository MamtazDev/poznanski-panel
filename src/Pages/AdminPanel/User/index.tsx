import {
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
import { apiGetReq, apiPutReq } from "../../../Constant/api-functions";
import { RootState } from "../../../reducers";

interface Users {
  _id: string;
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
  const [filterText, setFilterText] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<string>("");
  const [userAllData, setUserAllData] = useState<Users[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const handleSaveVerification = async () => {
    try {
      await apiPutReq(`/auth/users/${selectedUserId}`, {
        isVerified: verificationStatus === "Verified",
      });
      setUserAllData((prevData) =>
        prevData.map((user) =>
          user.id === selectedUserId
            ? { ...user, isVerified: verificationStatus === "Verified" }
            : user,
        ),
      );

      onClose();
    } catch (error) {
      console.error("Error updating user verification status:", error);
    }
  };

  useEffect(() => {
    apiGetReq("/auth/users", { filter: filterText })
      .then((res) => setUserAllData(res))
      .catch((err) => console.error("Error fetching data:", err));
  }, [filterText]);

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
              <Th>Title</Th>
              <Th>Role</Th>
              <Th>Email</Th>
              <Th>Is Verified</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userAllData?.map((user) => (
              <Tr>
                <Td className="capitalize">{user.nickname}</Td>
                <Td className="capitalize">{user.role}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <div className="flex gap-2 items-center">
                    <h2 style={{ color: user.isVerified ? "green" : "red" }}>
                      {user.isVerified ? "Verified" : "Unverified"}
                    </h2>
                    <AiOutlineEdit
                      onClick={() => handleEditClick(user._id, user.isVerified)}
                      className="cursor-pointer"
                    />
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

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
