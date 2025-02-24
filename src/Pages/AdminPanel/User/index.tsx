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
  Select,
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

  const [selectedRole, setSelectedRole] = useState("user");
  const [nickName, setNickName] = useState("");

  const handleRoleChange = (e: any) => {
    setSelectedRole(e.target.value);
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

  const handleSaveVerification = async () => {
    try {
      await apiPutReq(`/auth/users/${selectedUserId}`, {
        isVerified: verificationStatus === "Verified",
        role: selectedRole,
        nickname: nickName,
      });
      setUserAllData((prevData) =>
        prevData.map((user) =>
          user.id === selectedUserId
            ? { ...user, isVerified: verificationStatus === "Verified" }
            : user
        )
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
        <div
          className={`mb-4 ${themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
            }`}
          style={{ width: "300px" }}
        >
          <InputGroup>
            <Input
              type="text"
              placeholder="Search..."
              onChange={handleChangeFilterText}
            />
            <InputRightElement pointerEvents="none">
              <AiOutlineSearch />
            </InputRightElement>
          </InputGroup>
        </div>
      </div>

      {/* <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead
            className={`text-xs uppercase ${
              themeMode
                ? "text-white bg-[#5A1073]"
                : "bg-[#3bd6c6] text-[#5A1073]"
            }`}
          >
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

                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer> */}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full h-full" style={{ minWidth: "400px" }}>
          <thead
            className={`text-xs uppercase ${themeMode
                ? "text-white bg-[#5A1073]"
                : "bg-[#3bd6c6] text-[#5A1073]"
              }`}
          >
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Is Verified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {userAllData.map((user) => (
              <tr
                key={user._id}
                className={`border-b py-3 ${!themeMode
                    ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "bg-white text-gray-900 hover:bg-gray-200"
                  }`}
              >
                <td className="py-3">{user.nickname}</td>
                <td className="py-3">{user.role}</td>
                <td className="py-3">{user.email}</td>
                <td className="py-3">
                  <div className="">
                    <h2 style={{ color: user.isVerified ? "green" : "red" }}>
                      {user.isVerified ? "Verified" : "Unverified"}
                    </h2>
                  </div>
                </td>
                <td> <AiOutlineEdit
                  onClick={() => handleEditClick(user._id, user.isVerified)}
                  className="cursor-pointer mr-5"
                /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <div className={` h-[350px] rounded-md ${themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
            }`}>
            <ModalHeader>Edit User Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <RadioGroup
                onChange={handleVerificationChange}
                value={verificationStatus}
              >
                <Input type="text" onChange = {(e) => setNickName(e.target.value) }  placeholder="Edit your name..." className="mb-2"/>

                <Stack direction="column">
                  <Radio value="Verified" style={{
                    color: themeMode ? "#5ae3cc" : "#5A1073"
                  }}>Verified</Radio>
                  <Radio value="Unverified" style={{
                    color: themeMode ? "#5ae3cc" : "#5A1073",
                  }}>Unverified</Radio>
                </Stack>
              </RadioGroup>
              <div className="mt-4">
                <label htmlFor="role" className="block text-sm font-medium">Select Role</label>
                <Select id="role" value={selectedRole} onChange={handleRoleChange} className={` mt-2 focus:outline-none`} style={{
                  backgroundColor: themeMode ? "#f1f1f6" : "#34495e"
                }}>
                  <option value="" style={{
                    outline: "none",
                    backgroundColor: themeMode ? "#f1f1f6" : '#34495e'
                  }}>Select Role</option>
                  <option value="user" className="rounded-md" style={{
                    backgroundColor: themeMode ? "#f1f1f6" : '#34495e'
                  }}>User</option>
                  <option value="admin" style={{
                    backgroundColor: themeMode ? "#f1f1f6" : '#34495e'
                  }}>Admin</option>
                </Select>
              </div>
            </ModalBody>
            <ModalFooter className="space-x-2">
              <Button colorScheme="blue" onClick={handleSaveVerification}>
                Save
              </Button>
              <Button variant="red" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserMainPage;
