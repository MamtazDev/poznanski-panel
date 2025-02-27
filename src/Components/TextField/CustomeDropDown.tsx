import { useState } from "react";
import useSWR from "swr";
import { Menu, MenuButton, MenuList, MenuItem, Button, Flex, Image, Text, Spinner } from "@chakra-ui/react";
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

const CustomDropdown = () => {
  const [selected, setSelected] = useState<Record | null>(null);
  const { data, error, isLoading } = useSWR("http://localhost:8000/api/radio", fetcher);
  const records: Record[] = data?.records || [];

  const handleSelect = (record: Record) => setSelected(record);

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BiArrowFromBottom />} w="250px" textAlign="left">
        <Flex align="center">
          {selected ? (
            <>
              <Image src={selected.thumbnail} boxSize="30px" borderRadius="md" mr={2} />
              <Text noOfLines={1}>{selected.title}</Text>
            </>
          ) : (
            <Text>Select Radio</Text>
          )}
        </Flex>
      </MenuButton>

      <MenuList maxH="200px" overflowY="auto" maxW="400px">
        {isLoading ? (
          <Flex justify="center" align="center" p={4}><Spinner size="md" /></Flex>
        ) : error ? (
          <Text p={2} color="red.500">Failed to load data.</Text>
        ) : records.length ? (
          records.map((record) => (
            <MenuItem key={record._id} onClick={() => handleSelect(record)}>
              <Flex align="center">
                <Image src={record.thumbnail} boxSize="40px" borderRadius="md" mr={3} />
                <Text fontWeight="bold" noOfLines={1}>{record.title}</Text>
              </Flex>
            </MenuItem>
          ))
        ) : (
          <Text p={2}>No records found</Text>
        )}
      </MenuList>
    </Menu>
  );
};

export default CustomDropdown;
