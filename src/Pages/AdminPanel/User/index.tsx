import {
  Avatar,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import CommonButton from "../../../Components/Buttons/CommonButton";
import { apiGetReq } from "../../../Constant/api-functions";
import { RootState } from "../../../reducers";

interface Users {
  id: string;
  nickname: string;
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
  const [userAllData, setUserAllData] = useState<UserDataProps | null>(null);

  const handleAddArticle = () => {
    setOpenAddModal(true);
  };

  const handleChangeFilterText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
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
        <CommonButton text="Add article" onClick={handleAddArticle} />
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
            {userAllData?.map((users: { nickname: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; role: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; email: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; isVerified: any; }, index: Key | null | undefined) => (
              <Tr key={index}>
                <Td>
                  <Avatar name={users.nickname} src="" />
                </Td>
                <Td className="capitalize">{users.nickname}</Td>
                <Td className="capitalize">{users.role}</Td>
                <Td>{users.email}</Td>
                <Td className="capitalize">
                  {users.isVerified ? "Verified" : "Unverified"}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserMainPage;
