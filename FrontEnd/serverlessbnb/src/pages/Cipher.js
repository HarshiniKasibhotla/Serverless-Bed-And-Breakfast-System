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
  Badge,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineSmallDash, AiOutlineCheckCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { ReactSession } from "react-client-session";
import LexBotCommon from "../components/LexBotCommon";

const validationSchema = Yup.object({
  answer: Yup.string().required("No answer provided!"),
});

export default function Cipher() {
  let navigate = useNavigate();
  // console.log(value);

  const randomWords = require("random-words");
  const [randomword] = useState(randomWords());

  const user_id = ReactSession.get("user_id");
  const first_name = ReactSession.get("first_name");
  const last_name = ReactSession.get("last_name");
  const key = ReactSession.get("cipher_key");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data) => {
    const user = {
      user_id: user_id,
      normal_text: randomword,
      cipher_text: data.answer,
      cipher_key: key,
    };
    const url =
      " https://jknar1hixd.execute-api.us-east-1.amazonaws.com/Staging/login3";

    axios
      .post(url, user)
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          toast.success(response.data.message);
          if (first_name === "admin" || last_name === "admin") {
            console.log(first_name.toString());
            navigate("/adminHome");
          } else {
            console.log("here");
            navigate("/");
          }
          // window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response.status === 401 || error.response.status === 500) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.response.data.message);
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
              Welcome back !
            </Heading>
            <Stack direction={"column"}>
              <Button rightIcon={<AiOutlineCheckCircle color="green" />}>
                credentials
              </Button>
              <Button rightIcon={<AiOutlineCheckCircle color="green" />}>
                security Q&A
              </Button>
              <Button rightIcon={<AiOutlineSmallDash color="green" />}>
                Cipher
              </Button>
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
                Cipher
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
              <Stack spacing={4}>
                <Input
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  value={
                    "Encrypt this text with the key you got at registration "
                  }
                  readOnly
                />
                <Center>
                  <Heading fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}>
                    <Text
                      as={"span"}
                      bgGradient="linear(to-r, red.400,pink.400)"
                      bgClip="text"
                    >
                      {randomword}
                    </Text>
                  </Heading>
                </Center>
                <Input
                  {...register("answer")}
                  placeholder="Answer"
                  bg={"gray.100"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{
                    color: "gray.500",
                  }}
                  type="text"
                />
                {errors.answer && (
                  <Stack direction="row">
                    <Badge variant="solid" colorScheme="green">
                      {errors.answer.type}
                    </Badge>
                    <Text>{errors.answer.message}</Text>
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
            form
          </Stack>
        </Container>
      </Box>
      <LexBotCommon />
    </React.Fragment>
  );
}
