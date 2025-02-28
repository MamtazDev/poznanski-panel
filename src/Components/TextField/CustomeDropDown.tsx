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
            <Flex align="center" gap={2} wrap="wrap">
              {selectedRecords.map((record) => (
                <Flex
                  key={record._id}
                  align="center"
                  bg="gray.100"
                  px={2}
                  py={1}
                  borderRadius="md"
                >
                  <Image
                    src={record.thumbnail}
                    boxSize="20px"
                    borderRadius="md"
                    mr={1}
                  />
                  <Text fontSize="sm" noOfLines={1}>
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
