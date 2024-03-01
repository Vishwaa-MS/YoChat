import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState();
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const Toast = useToast();
  const { user, SelectChat, setSelectedChat } = ChatState();

  const fetchMessages = async () => {
    if (!SelectChat) return;
    setLoading(false);
    try {
      const { data } = await axios({
        url: `http://127.0.0.1:5000/api/messages/${SelectChat._id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        responseType: "json",
      });
      console.log(messages);
      setMessages(data);
      setLoading(false);
    } catch (error) {
      Toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [SelectChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        const { data } = await axios({
          url: `http://127.0.0.1:5000/api/messages`,
          method: "post",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            content: newMessage,
            chatId: SelectChat._id,
          },
          responseType: "json",
        });
        console.log(data);

        setMessages([...messages, data.content]);
      } catch (error) {
        Toast({
          title: "Error sending the chats",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing Indicator Logic
  };

  return (
    <>
      {SelectChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!SelectChat.isGroupChat ? (
              <>
                {getSender(user, SelectChat.users)}
                <ProfileModel user={getSenderFull(user, SelectChat.users)} />
              </>
            ) : (
              <>
                {SelectChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder={"Enter a message..."}
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
