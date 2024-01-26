import React from "react";
import {
  Box,
  Container,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import Login from "../components/Authentication/login";
import Signup from "../components/Authentication/signup";

const Homepage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex "
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="20px"
        borderWidth="2.5px"
        borderColor="purple"
      >
        <Text
          fontFamily={"Work sans"}
          fontSize={"4xl"}
          color={"purple"}
          textAlign={"center"}
          fontWeight={"bold"}
        >
          YoChat
        </Text>
      </Box>
      <Box
        p={4}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="20px"
        borderWidth="2.5px"
        borderColor="purple"
        color={"purple"}
      >
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList mb={"1em"}>
            <Tab color={"purple"} width={"50%"}>
              Login
            </Tab>
            <Tab color={"purple"} width={"50%"}>
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
