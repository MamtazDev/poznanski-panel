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
import { useSelector } from "react-redux";
import { apiGetReq, apiPutReq } from "../../../Constant/api-functions";
import { RootState } from "../../../reducers";
import { AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { mutate } from "swr";

interface Users {
  blockStatus: string;
  _id: string;
  id: string;
  nickname: string;
  role: string;
  email: string;
  block: string;
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
  const [selectedBlock, setSelectedBlock] = useState("Unblocked");
  const [nickName, setNickName] = useState("");

  const handleRoleChange = (e: any) => {
    setSelectedRole(e.target.value);
  };
  // add for block
  const handleBlockChange = (value: string) => {
    setSelectedBlock(value);
  };

  const handleChangeFilterText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  // const handleEditClick = (userId: string, isVerified: boolean) => {
  //   setSelectedUserId(userId);
  //   setVerificationStatus(isVerified ? "Verified" : "Unverified");
  //   onOpen();
  // };

  const handleEditClick = (userId: string, nickname: string, role: string, isVerified: boolean, blockStatus: string) => {
    console.log("userId", userId)
    setSelectedUserId(userId);
    setNickName(nickname); // Set the nickname to the current value
    setSelectedRole(role); // Set the role to the current value
    setVerificationStatus(isVerified ? "Verified" : "Unverified"); // Set the verification status
    setSelectedBlock(blockStatus); // Set the block/unblock status
    onOpen();
  };


  const handleVerificationChange = (status: string) => {
    setVerificationStatus(status);
  };

  const handleSaveVerification = async () => {
    console.log("selectedUserId", selectedUserId)
    try {
      await apiPutReq(`/auth/users/${selectedUserId}`, {
        isVerified: verificationStatus === "Verified",
        role: selectedRole,
        nickname: nickName,
        block: selectedBlock,
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


// for delete modal

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const handleOpenDeleteModal = (userId: string) => {
    setDeleteUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteUserId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    try {
      await fetch(`http://localhost:8000/api/auth/users/${deleteUserId}`, {
        method: "DELETE",
      });

      // Revalidate user list after successful delete
      mutate("http://localhost:8000/api/auth/users");

      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // if (error) return <p className="text-red-500">Failed to load users.</p>;
  // if (!userAllData) return <p>Loading...</p>;

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
              <th className="px-6 py-3">Action</th>
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
                <td>
                  <div className="flex gap-4 justify-center">
                  <button onClick={() => handleEditClick(user._id, user.nickname, user.role, user.isVerified, user.blockStatus)}>
                      <AiOutlineEdit className="cursor-pointer mr-5" />
                    </button>
                    <button onClick={() => handleOpenDeleteModal(user._id)}>
                    <MdOutlineDelete className="cursor-pointer" />
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`p-4 rounded-md ${themeMode ? "bg-white text-gray-900" : "bg-gray-800 text-white"} shadow-md`}>
            <p className="text-sm mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseDeleteModal}
                className="px-3 py-1 text-sm bg-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <div className={`h-full rounded-md ${themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"}`}>
      <ModalHeader>Edit User Details</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Input
          type="text"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
          placeholder="Edit your name..."
          className="mb-2"
        />

        <Stack direction="column">
          <Radio
            value="Verified"
            style={{ color: themeMode ? "#5ae3cc" : "#5A1073" }}
            isChecked={verificationStatus === "Verified"}
          >
            Verified
          </Radio>
          <Radio
            value="Unverified"
            style={{ color: themeMode ? "#5ae3cc" : "#5A1073" }}
            isChecked={verificationStatus === "Unverified"}
          >
            Unverified
          </Radio>
        </Stack>

        <div className="mt-4">
          <label htmlFor="role" className="block text-sm font-medium">Select Role</label>
          <Select
            id="role"
            value={selectedRole}
            onChange={handleRoleChange}
            className="mt-2 focus:outline-none"
            style={{ backgroundColor: themeMode ? "#f1f1f6" : "#34495e" }}
          >
            <option value="user" style={{ backgroundColor: themeMode ? "#f1f1f6" : '#34495e' }}>User</option>
            <option value="admin" style={{ backgroundColor: themeMode ? "#f1f1f6" : '#34495e' }}>Admin</option>
          </Select>
        </div>

        {/* Block/Unblock Radio Group */}
        <div className="mt-4">
          <label className="block text-sm font-medium">Account Status</label>
          <RadioGroup
            value={selectedBlock}
            onChange={handleBlockChange}
          >
            <Stack direction="row">
              <Radio value="Blocked" style={{ color: themeMode ? "#d9534f" : "#ff6b6b" }}>
                Block
              </Radio>
              <Radio value="Unblocked" style={{ color: themeMode ? "#5ae3cc" : "#5A1073" }}>
                Unblock
              </Radio>
            </Stack>
          </RadioGroup>
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

      {/* <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <div className={`h-full rounded-md ${themeMode ? "text-gray-800 bg-white" : "bg-gray-800 text-white"
            }`}>
            <ModalHeader>Edit User Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <RadioGroup
                onChange={handleVerificationChange}
                value={verificationStatus}
              >
                <Input type="text" onChange={(e) => setNickName(e.target.value)} placeholder="Edit your name..." className="mb-2" />

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


              <div className="mt-4">
                <label className="block text-sm font-medium">Account Status</label>
                <RadioGroup
                  value={selectedBlock}
                  onChange={handleBlockChange}
                >
                  <Stack direction="row">
                    <Radio value="Blocked" style={{ color: themeMode ? "#d9534f" : "#ff6b6b" }}>Block</Radio>
                    <Radio value="Unblocked" style={{ color: themeMode ? "#5ae3cc" : "#5A1073" }}>Unblock</Radio>
                  </Stack>
                </RadioGroup>
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
      </Modal> */}

    </div>
  );
};

export default UserMainPage;
