import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reducers';
import CommonButton from '../../../Components/Buttons/CommonButton';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import staticImg from '../../../assets/png/defaultimg.png';
import { apiGetReq } from '../../../Constant/api-functions';

interface Users {
  id: string;
  nickname: string;
}

interface UserDataProps {
  user: Users[]; // Assuming the `user` property holds the actual user data.
}

const UserMainPage: React.FC<UserDataProps> = () => {
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>("");
  const [selectedRowsNum, setSelectedRowsNum] = useState<number>(5);
  const [selectedPage, setSelectedPage] = useState<string>("1");
  const [userAllData, setUserAllData] = useState<UserDataProps | null>(null);
  console.log(userAllData, "userAllDatauserAllData")
  const handleAddArticle = () => {
    setOpenAddModal(true);
  };

  const handleChangeFilterText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };
  const fetchUserAllData = userAllData?.user || [];
  console.log("Fetched User Data:", fetchUserAllData);


  useEffect(() => {
    apiGetReq("/users", {
      filter: filterText,
    })
      .then((res) => {
        console.log("API Response Full Data:", res);
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

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full h-full" style={{ minWidth: "400px" }}>
          <thead
            className={`text-xs uppercase ${themeMode ? " text-gray-700  bg-gray-400" : "bg-gray-700 text-gray-400"}`}
          >
            <tr>
              <th className="px-6 py-3" style={{ width: "130px" }}>Image</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3 w-28">Tag</th>
              <th className="px-6 py-3 w-32">Date</th>
              <th className="px-6 py-3 w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {fetchUserAllData.map((user) => (
              <tr
                key={user.id}
                className={`border-b py-3 ${!themeMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white text-gray-900"}`}
              >
                <td className="flex justify-center mt-3">
                  <img src={staticImg} className="rounded-full w-[100px] h-[100px]" alt="img" />
                </td>
                <td style={{ width: "200px" }}>tags</td>
                <td>date</td>
                <td>
                  <div className="flex justify-center">
                    {/* Actions can go here */}
                  </div>
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserMainPage;
