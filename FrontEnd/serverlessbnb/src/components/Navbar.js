import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Heading,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { BsBell } from "react-icons/bs";
import { ReactSession } from "react-client-session";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Notification from "./Notification";
import { useEffect } from "react";

const Links = [
  { field: "Rooms", navlink: "/roombook" },
  { field: "Meals", navlink: "/meals" },
  { field: "Tour Suggestions", navlink: "/tours" },
  { field: "Feedback", navlink: "/feedback" },
];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Navbar({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  var location = useLocation();
  ReactSession.setStoreType("localStorage");
  const userId = ReactSession.get("user_id");
  useEffect(() => {}, [location]);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <RouterLink to="/">
              <Heading fontSize={{ base: "lg", sm: "lg", md: "xl", lg: "xl" }}>
                ServerlessB
                <Text
                  as={"span"}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  bgClip="text"
                >
                  n
                </Text>
                B
              </Heading>
            </RouterLink>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map(
                (link) =>
                  userId && (
                    <RouterLink to={link.navlink}>
                      <NavLink key={link.field}>{link.field}</NavLink>
                    </RouterLink>
                  )
              )}
              <Notification />
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <RouterLink to="/login">
              <Button as={Button} cursor={"pointer"} minW={0}>
                SignIn/Up
              </Button>
            </RouterLink>
            {userId && (
              <RouterLink to="/logout">
                <Button as={Button} cursor={"pointer"} minW={0}>
                  Logout
                </Button>
              </RouterLink>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.field}>{link.field}</NavLink>
              ))}
            </Stack>
            <Menu>
              <MenuButton cursor={"pointer"} minW={0}>
                <IconButton
                  colorScheme="gray"
                  aria-label="Search database"
                  icon={<BsBell />}
                  _after={{
                    content: '""',
                    w: 3,
                    h: 3,
                    bg: "green.300",
                    border: "2px solid white",
                    rounded: "full",
                    pos: "absolute",
                    top: 2,
                    right: 2,
                  }}
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Food is preparing </MenuItem>
                <MenuItem>Meal order is received</MenuItem>
                <MenuDivider />
                <MenuItem>Room 101 booked</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        ) : null}
      </Box>

      <Box p={4}>{children}</Box>
    </>
  );
}
