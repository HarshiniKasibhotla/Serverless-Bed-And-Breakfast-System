import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { ReactSession } from "react-client-session";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Navigate } from "react-router-dom";
import LexBot from "../components/LexBot";
import { toast } from "react-toastify";

export default function RoomBook() {
  const [selectedRoom, setRoom] = useState("101");
  const [value, onChange] = useState(new Date());
  const [numOfPeople, setNumOfPeople] = useState(0);
  const [availability, setAvailability] = useState([]);

  ReactSession.setStoreType("localStorage");
  const user_id = ReactSession.get("user_id");
  const [avail, setAvail] = useState([]);

  let navigate = useNavigate();

  var [number, setNumber] = useState();

  useEffect(() => {
    axios
      .get(
        "https://jknar1hixd.execute-api.us-east-1.amazonaws.com/Staging/roomavailability"
      )
      .then((data) => {
        setAvail(data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = () => {
    var d1 = new Date(value[0]);
    var d2 = new Date(value[1]);
    setNumber(parseInt(d2.getDate()) - parseInt(d1.getDate()));
    ReactSession.set("number", parseInt(d2.getDate()) - parseInt(d1.getDate()));

    axios
      .post(
        "https://jknar1hixd.execute-api.us-east-1.amazonaws.com/Staging/roombooking",
        {
          room_number: selectedRoom,
          checkin_date: value[0].toLocaleDateString("en-CA") + " 00:00:00",
          checkout_date: value[1].toLocaleDateString("en-CA") + " 00:00:00",
          user_id: user_id,
          no_of_people: numOfPeople,
          // price: parseInt(selectedRoom) * numOfPeople,
        }
      )
      .then((data) => {
        ReactSession.set("r_people_count", numOfPeople);
        ReactSession.set("room_number", selectedRoom);
        ReactSession.set("checkinDate", d1);
        ReactSession.set("checkoutDate", d2);
        ReactSession.set("r_price", parseInt(data.data.price));

        const responseMessage = data["data"]["message"];

        if (
          responseMessage === "Please enter valid check-in and check-out dates"
        ) {
          toast.error(responseMessage);
        } else {
          toast.success(responseMessage);
          ReactSession.set("r_booking_id", data["data"]["booking_id"]);
          navigate("/roominvoice");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <Box position={"relative"}>
        <Container
          as={SimpleGrid}
          maxW={"7xl"}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 5, sm: 10, lg: 22 }}
        >
          <Stack spacing={{ base: 10, md: 20 }}>
            <Heading
              lineHeight={1.1}
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
            >
              Availabil
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                i
              </Text>
              ty
            </Heading>

            <Stack direction={"column"}>
              <Calendar
                onChange={onChange}
                value={value}
                selectRange={true}
                tileDisabled={({ activeStartDate, date, view }) => {
                  if (avail.length > 0) {
                    var disabled = false;
                    var from =
                      avail &&
                      avail.filter((av) => av.room_number === selectedRoom)[0]
                        .available_from;
                    disabled = date <= new Date(from);
                    return disabled;
                  }
                }}
              />
            </Stack>
          </Stack>
          <Stack
            bg={"gray.50"}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: "lg" }}
          >
            <Stack spacing={4}>
              <Heading
                color={"gray.800"}
                lineHeight={1.1}
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              >
                Get the room
                <Text
                  as={"span"}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  bgClip="text"
                >
                  !
                </Text>
              </Heading>
              <Stack direction={"row"}>
                {avail.length > 0
                  ? avail.map((room, i) =>
                      parseInt(room.room_number) <= 105 ? (
                        selectedRoom === room.room_number ? (
                          <Button
                            key={i}
                            shadow={"lg"}
                            colorScheme="teal"
                            size="lg"
                            _active={{
                              backgroundColor: "blue",
                            }}
                            onClick={() => setRoom(room.room_number)}
                          >
                            {room.room_number}
                          </Button>
                        ) : (
                          <Button
                            key={i}
                            colorScheme="teal"
                            size="md"
                            _active={{
                              backgroundColor: "blue",
                            }}
                            onClick={() => setRoom(room.room_number)}
                          >
                            {room.room_number}
                          </Button>
                        )
                      ) : null
                    )
                  : null}
              </Stack>
              <Stack direction={"row"}>
                {avail?.map((room, i) =>
                  parseInt(room.room_number) > 105 ? (
                    selectedRoom === room.room_number ? (
                      <Button
                        key={i}
                        shadow={"lg"}
                        colorScheme="teal"
                        size="lg"
                        _active={{
                          backgroundColor: "blue",
                        }}
                        onClick={() => setRoom(room.room_number)}
                      >
                        {room.room_number}
                      </Button>
                    ) : (
                      <Button
                        key={i}
                        colorScheme="teal"
                        size="md"
                        _active={{
                          backgroundColor: "blue",
                        }}
                        onClick={() => setRoom(room.room_number)}
                      >
                        {room.room_number}
                      </Button>
                    )
                  ) : null
                )}
              </Stack>
            </Stack>
            <Box as={"form"} mt={10}>
              <Stack spacing={4}>
                <Input
                  placeholder="Number of people"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  type="number"
                  onChange={(e) => setNumOfPeople(e.target.value)}
                />
                {/* <Input
                  readOnly
                  placeholder="Price"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  value={parseInt(selectedRoom) * numOfPeople}
                  type="number"
                /> */}
              </Stack>
              <Button
                fontFamily={"heading"}
                mt={8}
                w={"full"}
                bg={"gray.200"}
                color={"gray.800"}
                _hover={{
                  boxShadow: "lg",
                }}
                onClick={() => handleSubmit()}
              >
                Submit
              </Button>
            </Box>
            form
          </Stack>
        </Container>
      </Box>
      <LexBot />
    </React.Fragment>
  );
}
