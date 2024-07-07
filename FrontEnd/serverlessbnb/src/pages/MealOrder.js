import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  Badge,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ReactSession } from "react-client-session";
import { toast } from "react-toastify";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import LexBot from "../components/LexBot";

const validationSchema = Yup.object({
  count: Yup.string().required(),
});

export default function MealOrder() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const [selectedMeal, setSelectedMeal] = useState({
    food_name: "Parantha",
    price: 10,
    count: 0,
  });
  const [availability, setAvailability] = useState([]);
  const [count, setCount] = useState(0);

  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        "https://jknar1hixd.execute-api.us-east-1.amazonaws.com/Staging/availablefood"
      )
      .then((data) => setAvailability(data.data.available_food_list))
      .catch((err) => console.log(err));

    console.log(availability);
  }, []);

  // const getprice = () => {
  //   return selectedMeal.price * selectedMeal.count;
  // };

  ReactSession.setStoreType("localStorage");

  const onSubmit = (data) => {
    ReactSession.setStoreType("localStorage");
    const user_id = ReactSession.get("user_id");

    // console.log(data);

    const meal = {
      user_id: user_id || "test-id",
      order_list: [
        {
          food_name: selectedMeal.food_name,
          count: selectedMeal.count,
          itemPrice: selectedMeal.price,
        },
      ],
    };
    console.log(meal);
    // console.log("meal_type");
    // console.log("no_of_meals");
    // console.log("price");
    //Make a API call to backend to register the user to the application
    const url =
      "https://jknar1hixd.execute-api.us-east-1.amazonaws.com/Staging/orderfood";
    axios
      .post(url, meal)
      .then((response) => {
        // console.log(response);
        ReactSession.set("food_item", selectedMeal.food_name);
        ReactSession.set("item_count", selectedMeal.count);
        //replace the selectedMeal with response
        ReactSession.set("f_price", response.data.totalPrice);
        console.log(response.data);
        if (response.status === 200) {
          ReactSession.set("order_id", response.data.order_id);
          toast.success(response.data.message, { position: "top-center" });
          navigate("/foodinvoice/" + user_id);
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

  // console.log(availability);
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
              Me
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                n
              </Text>
              u
            </Heading>

            <Stack direction={"column"}>
              {availability?.map((item, i) =>
                selectedMeal === item.food_name ? (
                  <Button
                    disabled={item.count <= 0 ? true : false}
                    key={"meal-" + i}
                    shadow={"lg"}
                    _active={{
                      backgroundColor: "blue.200",
                    }}
                    onClick={() => setSelectedMeal(item)}
                  >
                    {item.food_name} : {item.count} left
                  </Button>
                ) : (
                  <Button
                    disabled={item.count <= 0 ? true : false}
                    key={"meal-" + i}
                    _active={{
                      backgroundColor: "blue.200",
                    }}
                    onClick={() => setSelectedMeal(item)}
                  >
                    {item.food_name} : {item.count} left
                  </Button>
                )
              )}
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
                Get the meal
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
            <Box as={"form"} mt={10} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <Input
                  readOnly
                  placeholder="Selected dish"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  value={selectedMeal.food_name}
                  type="text"
                />
                <Input
                  {...register("count")}
                  placeholder="How many dishes"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  type="String"
                  onChange={(e) =>
                    setSelectedMeal((prev) => ({
                      ...prev,
                      count: e.target.value,
                    }))
                  }
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
                  value={"$" + getprice()}
                  type="text"
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
                type="submit"
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
