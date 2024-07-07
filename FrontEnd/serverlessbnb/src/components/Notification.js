import React, { useEffect, useState } from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { BsBell } from "react-icons/bs";
import { ReactSession } from "react-client-session";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Notification({ firebaseApp }) {
  const [newNotification, setNewNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  ReactSession.setStoreType("localStorage");
  const user_id = ReactSession.get("user_id");

  useEffect(() => {
    if (user_id && user_id.length > 0) {
      const unsub = onSnapshot(collection(db, user_id), (doc) => {
        const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        var messages = doc.docs.map((doc) => doc.data());
        setNotifications(messages);
        console.log(messages);
        console.log(user_id);
      });
    }

    // const data = async () => {
    //   const citiesCol = collection(db, "notifications");
    //   const citySnapshot = await getDocs(citiesCol);
    //   const cityList = citySnapshot.docs.map((doc) => doc.data());
    //   return cityList;
    // };
    // console.log(data());
  }, [db]);

  return (
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
        {notifications.map((msg, idx) => (
          <MenuItem key={idx}>{msg.message}</MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
