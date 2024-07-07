import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  Center,
  Link,
  Select,
  Badge,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineSmallDash } from "react-icons/ai";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ReactSession } from "react-client-session";
import axios from "axios";
import { toast } from "react-toastify";
import LexBot from "../components/LexBot";

const validationSchema = Yup.object({
  feedbacktype: Yup.string().required(),
  feedbackanswer: Yup.string().required(),
});

export default function FeedBack() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  let navigate = useNavigate();

  ReactSession.setStoreType("localStorage");
  const user_id = ReactSession.get("user_id");

  const onSubmit = (data) => {
    axios
      .post(
        "https://us-east4-assignment4-355620.cloudfunctions.net/sentimentAnalyzer",
        {
          feedback: data.feedbackanswer,
        }
      )
      .then(function (response) {
        console.log(response.data.toString());

        axios
          .post(
            "https://s7mcgcl52oqhvffcugby33piu40mjtsf.lambda-url.us-east-1.on.aws/",
            {
              feedbackType: data.feedbacktype,
              sentimentScore: response.data.toString(),
              booking_id: "8734384",
              feedbackText: data.feedbackanswer,
            }
          )
          .then(function (response) {
            if (response.status === 200) {
              toast.success("Your feedback is submitted!", {
                position: "top-center",
              });
              navigate("/feedbackcomponent");
            }
          });
      })
      .catch(function (error) {
        console.log(error);
      })
      .catch(function (error) {
        console.log(error);
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
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
            >
              Give your
            </Heading>
            <Heading
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
            >
              Feedback here
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              ></Text>
            </Heading>
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
                Feedback
                <Text
                  as={"span"}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  bgClip="text"
                >
                  !
                </Text>
              </Heading>
            </Stack>
            <Box as={"form"} mt={10} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <Select
                  variant="filled"
                  color={"gray.500"}
                  {...register("feedbacktype")}
                >
                  <option value="Food" selected>
                    Food
                  </option>
                  <option value="Room">Room</option>
                  <option value="Tour">Tour</option>
                </Select>
                {errors.feedbacktype && (
                  <Stack direction="row">
                    <Badge variant="solid" colorScheme="green">
                      {errors.feedbacktype.type}
                    </Badge>
                    <Text>{errors.feedbacktype.message}</Text>
                  </Stack>
                )}
                <Input
                  {...register("feedbackanswer")}
                  bg={"gray.100"}
                  border={0}
                  //paddingBottom={170}
                  placeholder="Enter your feedback here!"
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  type="text"
                />
                {errors.feedbackanswer && (
                  <Stack direction="row">
                    <Badge variant="solid" colorScheme="green">
                      {errors.feedbackanswer.type}
                    </Badge>
                    <Text>{errors.feedbackanswer.message}</Text>
                  </Stack>
                )}
              </Stack>

              <Button
                fontFamily={"heading"}
                my={8}
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
          </Stack>
        </Container>
      </Box>
      <LexBot />
    </React.Fragment>
  );
}
