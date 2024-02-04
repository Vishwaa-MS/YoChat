import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import ProfileModel from "./ProfileModel";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setloadingChat] = useState();

  const { user, SelectedChat, setSelectedChat, chats, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const history = useHistory();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something To Search",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    } else {
      try {
        setLoading(true);
        const { data } = await axios({
          url: `http://127.0.0.1:5000/api/user?search=${search}`,
          method: "get",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          responseType: "json",
        });
        setSearchResult(data);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to load the search results",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);
    try {
      setloadingChat(true);
      const { data } = await axios({
        url: `http://127.0.0.1:5000/api/chat`,
        method: "post",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        data: { userId },
        responseType: "json",
      });

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      console.log(data);
      setloadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={"4"}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"Work sans"} fontWeight={"bold"}>
          YoChat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    accessChat(user._id);
                  }}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"slex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
