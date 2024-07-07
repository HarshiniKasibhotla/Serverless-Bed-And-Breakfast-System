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
  Badge
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineSmallDash } from "react-icons/ai";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { ReactSession } from "react-client-session";
import axios from "axios";
import LexBotCommon from "../components/LexBotCommon";

const validationSchema = Yup.object({
  email: Yup.string().required().email(),
  password: Yup.string()
    .required("No password provided.")
    .matches(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/,
      "Password did not confirm with policy: Password must have uppercase characters, Here are the Password requirements :=> 1) Password minimum length: 8 character(s), 2) Contains at least 1 number, 3)Contains at least 1 uppercase letter"
    )
});

export default function Login() {
  let navigate = useNavigate();
  // console.log(value);

  ReactSession.setStoreType("localStorage");


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data) => {
    const user = {
      email: data.email.toLowerCase(),
      password: data.password
    };
    const url =
        "https://jknar1hixd.execute-api.us-east-1.amazonaws.com/Staging/login1";

      axios
        .post(url, user)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            toast.success(response.data.message);
            
            console.log("here1")
            ReactSession.set("user_id", response.data.user_id);
            ReactSession.set("security_ques", response.data.security_ques);
            ReactSession.set("cipher_key", response.data.cipher_key);
            ReactSession.set("first_name",response.data.first_name);
            ReactSession.set("last_name",response.data.last_name);    
            
            navigate("/securityqna");
    
          }
        })
        .catch((error) => {
          console.log(error.response);
          if (
            error.response.status === 400 ||
            error.response.status === 401 ||
            error.response.status === 409 
          ) {
            toast.error(error.response.data.message);
          }
          else if (error.response.status === 500){
            toast.error("The service is down. Please try again!");
          }
           else {
            toast.error("Something went wrong");
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
            <Button rightIcon={<AiOutlineSmallDash color="green" />}>
              credentials
            </Button>
            <Button>security Q&A</Button>
            <Button>Cipher</Button>
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
              Login
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
                {...register("email")}
                placeholder="Email"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                type="email"
              />
              {errors.email && (
                <Stack direction="row">
                  <Badge variant="solid" colorScheme="green">
                    {errors.email.type}
                  </Badge>
                  <Text>{errors.email.message}</Text>
                </Stack>
              )}
              <Input
              {...register("password")}
                placeholder="Password"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                type="password"
              />
              {errors.password && (
                <Stack direction="row">
                  <Badge variant="solid" colorScheme="green">
                    {errors.password.type}
                  </Badge>
                  <Text>{errors.email.message}</Text>
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
            <Center>
              <Text>
                Do not have an account ?{" "}
                <RouterLink to="/register">
                  <Link>Register</Link>
                </RouterLink>
              </Text>
            </Center>
          </Box>
          form
        </Stack>
      </Container>
    </Box>
    <LexBotCommon/>
    </React.Fragment>
  );
}
