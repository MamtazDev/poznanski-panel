import { useState } from "react";
import useSWR from "swr";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  Image,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { BiArrowFromBottom } from "react-icons/bi";
import axios from "axios";

interface Artist {
  _id: string;
  name: string;
  profileImg: string;
}

interface Record {
  _id: string;
  title: string;
  youTube: string;
  thumbnail: string;
  artists: Artist[];
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface TableProps {
  setSongsList: (songs: string[]) => void;
}

const CustomDropdown = ({ setSongsList }: TableProps) => {
  const [selectedRecords, setSelectedRecords] = useState<Record[]>([]);
  const { data, error, isLoading } = useSWR(
    "http://localhost:8000/api/radio",
    fetcher
  );
  const records: Record[] = data?.records || [];

  const handleSelect = (record: Record) => {
    setSelectedRecords((prevSelected) => {
      const isAlreadySelected = prevSelected.some((r) => r._id === record._id);
      const updatedSelection = isAlreadySelected
        ? prevSelected.filter((r) => r._id !== record._id) // Remove if already selected
        : [...prevSelected, record]; // Add if not selected

      setSongsList(updatedSelection.map((r) => r._id));
      return updatedSelection;
    });
  };

  return (
    <Menu>
      <Flex align="center" marginBottom={10}>
        {selectedRecords.length > 0 && (
          <>
            <Flex align="flex-start" gap={2} direction="column" w="100%">
              {selectedRecords.map((record, index) => (
                <Flex
                  key={record._id}
                  align="center"
                  bg="gray.100"
                  px={2}
                  py={1}
                  borderRadius="md"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", index.toString());
                    e.currentTarget.style.opacity = "0.5";
                  }}
                  onDragEnd={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.boxShadow = "0 0 5px #4299E1";
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.border = "2px solid #4299E1";
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.border = "none";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.border = "none";

                    const dragIndex = parseInt(
                      e.dataTransfer.getData("text/plain")
                    );
                    const dropIndex = index;

                    const newRecords = [...selectedRecords];
                    const draggedItem = newRecords[dragIndex];
                    newRecords.splice(dragIndex, 1);
                    newRecords.splice(dropIndex, 0, draggedItem);

                    setSelectedRecords(newRecords);
                    setSongsList(newRecords.map((r) => r._id));
                  }}
                  cursor="move"
                  transition="all 0.2s"
                  _hover={{ bg: "gray.200" }}
                  w="100%"
                >
                  <Image
                    src={record.thumbnail}
                    boxSize="20px"
                    borderRadius="md"
                    mr={1}
                  />
                  <Text fontSize="sm" noOfLines={1} color="gray.500">
                    {record.title}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </>
        )}
      </Flex>
      <MenuButton
        as={Button}
        rightIcon={<BiArrowFromBottom />}
        w="100%"
        textAlign="left"
      >
        <Text>Select Radio</Text>
      </MenuButton>

      <MenuList maxH="200px" overflowY="auto" maxW="400px">
        {isLoading ? (
          <Flex justify="center" align="center" p={4}>
            <Spinner size="md" />
          </Flex>
        ) : error ? (
          <Text p={2} color="red.500">
            Failed to load data.
          </Text>
        ) : records.length ? (
          records.map((record) => {
            const isSelected = selectedRecords.some(
              (r) => r._id === record._id
            );
            return (
              <MenuItem
                key={record._id}
                onClick={() => handleSelect(record)}
                bg={isSelected ? "gray.200" : "white"}
              >
                <Flex align="center">
                  <Image
                    src={record.thumbnail}
                    boxSize="40px"
                    borderRadius="md"
                    mr={3}
                  />
                  <Text fontWeight="bold" noOfLines={1}>
                    {record.title}
                  </Text>
                </Flex>
              </MenuItem>
            );
          })
        ) : (
          <Text p={2}>No records found</Text>
        )}
      </MenuList>
    </Menu>
  );
};

export default CustomDropdown;
