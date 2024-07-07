import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ReactSession } from "react-client-session";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import LexBot from "../components/LexBot";

export default function TourPlan() {
  // const [tour, setTour] = useState({ name: "Tour one", days: "10" });

  let navigate = useNavigate();
  let [price, setPrice] = useState(0);
  ReactSession.setStoreType("localStorage");
  const number = ReactSession.get("number");
  const user_id = ReactSession.get("user_id");
  const [loading, setLoading] = useState(true);
  const [tours, setData] = useState([]);
  const [tour, setTour] = useState({
    name: "",
    days: "",
    price: "",
  });


  const { handleSubmit, watch } = useForm();

  var [people, setPeople] = useState();
  var [count, setCount] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let { data: response } = await axios.post(
          "https://us-east4-assignment4-355620.cloudfunctions.net/getTourId",
          {
            stay_duration: number,
          }
        );
        response = [...response.split(",")];
        var grouped = [];

        for (let i = 0; i < response.length; i += 4) {
          grouped.push({
            name: response[i + 3].trim(),
            days: response[i + 1].trim(),
            price: response[i + 2].trim(),
          });
        }
        setData(grouped);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleClick = () => {
    const _tour = {
      no_of_people: count,
      user_id: user_id,
      price: tour.price,
      tour_name: tour.name,
    };
    ReactSession.set("tour_no_of_people", _tour.no_of_people);
    ReactSession.set("tour_name", _tour.tour_name);
    const url =
      "https://jknar1hixd.execute-api.us-east-1.amazonaws.com/Staging/tourbooking";
    axios
      .post(url, _tour)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message, { position: "top-center" });
          ReactSession.set("tour_booking_number", response.data.booking_number);
          ReactSession.set("tour_price", response.data.price);
          navigate("/tourinvoice");
        }
      })
      .catch((error) => {
        toast.error(error.response);
        if (
          error.response.status === 400 ||
          error.response.status === 409 ||
          error.response.status === 500
        ) {
          toast(error.response.data.message);
        } else {
          toast.error("something went wrong please try again!");
        }
      });
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
              Tou
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                r
              </Text>
              s
            </Heading>
            <Stack isInline spacing={8} align="center">
              {tours.map((tour, index) => {
                if (index < 3) {
                  return (
                    <Box
                      p={5}
                      shadow="md"
                      borderWidth="1px"
                      flex="1"
                      rounded="md"
                      onClick={() => setTour(tour)}
                      cursor="pointer"
                    >
                      <Heading fontSize="xl">{tour.name}</Heading>
                      <Text mt={4}>{tour.days} days tour</Text>
                      <Text mt={4}>{tour.price}$ Price</Text>
                    </Box>
                  );
                }
              })}
            </Stack>
            <Stack isInline spacing={8} align="center">
              {tours.map((tour, index) => {
                if (index >= 3) {
                  return (
                    <Box
                      p={5}
                      shadow="md"
                      borderWidth="1px"
                      flex="1"
                      rounded="md"
                      onClick={() => setTour(tour)}
                      cursor="pointer"
                    >
                      <Heading fontSize="xl">{tour.name}</Heading>
                      <Text mt={4}>{tour.days} days tour</Text>
                      <Text mt={4}>{tour.price}$ Price</Text>
                    </Box>
                  );
                }
              })}
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
                Get that tour
                <Text
                  as={"span"}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  bgClip="text"
                >
                  !
                </Text>
              </Heading>
              <Stack direction={"row"}></Stack>
            </Stack>
            <Stack spacing={4}>
              <Input
                readOnly
                placeholder="Tours"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                value={tour.name}
                type="text"
              />
              <Input
                id="people"
                placeholder="How many people?"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                type="number"
                onChange={(e) => setCount(e.target.value)}
              />
              {/* <Input
                readOnly
                // placeholder={parseInt(tour.price) * count}
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                value={parseInt(tour.price) * count}
                type="number"
                // onChange={setPrice(parseInt(tour.price) * people)}
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
              onClick={() => handleClick()}
            >
              Submit
            </Button>
            form
          </Stack>
        </Container>
      </Box>
      <LexBot />
    </React.Fragment>
  );
}
