import React, { useEffect, useState } from "react";
import axios from "axios";

const Chatpage = () => {
  const [chats, setChats] = useState([]);
  const fetchChats = async () => {
    const { data } = await axios({
      method: "get",
      url: "http://127.0.0.1:5000/",
      responseType: "json",
    });
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return <div></div>;
};

export default Chatpage;
