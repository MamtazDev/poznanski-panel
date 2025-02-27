import { useState } from "react";
import { Menu, MenuButton, MenuList, MenuItem, Button, Box, Flex, Image, Text } from "@chakra-ui/react";
import { BiArrowFromBottom } from "react-icons/bi";
// import { ChevronDownIcon } from "@chakra-ui/icons";

const options = [
  { id: 1, title: "Apple", image: "https://via.placeholder.com/30" },
  { id: 2, title: "Banana", image: "https://via.placeholder.com/30" },
  { id: 3, title: "Orange", image: "https://via.placeholder.com/30" },
];

const CustomDropdown = () => {
  const [selected, setSelected] = useState(options[0]); // Default selection

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BiArrowFromBottom/>} w="200px" textAlign="left">
        <Flex align="center">
          <Image src={selected.image} boxSize="20px" borderRadius="full" mr={2} />
          <Text>{selected.title}</Text>
        </Flex>
      </MenuButton>
      <MenuList>
        {options.map((option) => (
          <MenuItem key={option.id} onClick={() => setSelected(option)}>
            <Flex align="center">
              <Text>{option.title}</Text>
              <Image src={option.image} boxSize="20px" borderRadius="full" mr={2} />
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default CustomDropdown;
