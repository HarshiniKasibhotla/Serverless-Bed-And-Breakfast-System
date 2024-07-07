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
import axios from "axios";
import { toast } from "react-toastify";
import LexBotCommon from "../components/LexBotCommon";

const validationSchema = Yup.object({
  email: Yup.string().required().email(),
  firstName: Yup.string()
    .required()
    .matches(/^[a-zA-Z\s]+$/, "must be a valid first name.")
    .min(2, "First Name is too short - should be more than one character."),
  lastName: Yup.string()
    .required()
    .matches(/^[a-zA-Z\s]+$/, "must be a last valid name.")
    .min(2, "Last Name is too short - should be more than one character."),
  password: Yup.string()
    .required("No password provided.")
    .matches(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/,
      "Password did not confirm with policy: Password must have uppercase characters, Here are the Password requirements :=> 1) Password minimum length: 8 character(s), 2) Contains at least 1 number, 3)Contains at least 1 uppercase letter"
    ),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
  answer: Yup.string().required(),
});

export default function Reg() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  let navigate = useNavigate();
  // console.log(value);
  var min = 1;
  var max = 3;
  const [rand] = useState(Math.floor(Math.random() * (max - min + 1)) + min);

  const onSubmit = (data) => {
    console.log(data);
    const user = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      security_ques: data.securityQnA,
      security_ans: data.answer,
      cipher_key: rand,
    };
    //Make a API call to backend to register the user to the application
    const url =
      "https://jknar1hixd.execute-api.us-east-1.amazonaws.com/Staging/signup";
    axios
      .post(url, user)
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          toast.success(response.data.message, { position: "top-center" });
          navigate("/login");
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
          navigate("/register");
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
          <Heading fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}>
            Get started with
          </Heading>
          <Heading fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}>
            ServerlessB
            <Text
              as={"span"}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
            >
              n
            </Text>
            B
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
              Register
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
              <Input
                {...register("firstName")}
                placeholder="First name"
                aria-invalid={errors.name ? "true" : "false"}
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                type="text"
              />
              {errors.firstName && (
                <Stack direction="row">
                  <Badge variant="solid" colorScheme="green">
                    {errors.firstName.type}
                  </Badge>
                  <Text>{errors.firstName.message}</Text>
                </Stack>
              )}
              <Input
                {...register("lastName")}
                placeholder="Last name"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                type="text"
              />
              {errors.lastName && (
                <Stack direction="row">
                  <Badge variant="solid" colorScheme="green">
                    {errors.lastName.type}
                  </Badge>
                  <Text>{errors.lastName.message}</Text>
                </Stack>
              )}
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
                  <Text>{errors.password.message}</Text>
                </Stack>
              )}
              <Input
                {...register("confirmPassword")}
                placeholder="Confirm password"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                type="password"
              />
              {errors.confirmPassword && (
                <Stack direction="row">
                  <Badge variant="solid" colorScheme="green">
                    {errors.confirmPassword.type}
                  </Badge>
                  <Text>{errors.confirmPassword.message}</Text>
                </Stack>
              )}
              <Select
                variant="filled"
                color={"gray.500"}
                {...register("securityQnA")}
              >
                <option value="Name of your first pet" selected>
                  Name of your first pet
                </option>
                <option value="Name of your favourite color">
                  Name of your favourite color
                </option>
                <option value="Name of your Best Friend">
                  Name of your Best Friend
                </option>
              </Select>
              {errors.securityQnA && (
                <Stack direction="row">
                  <Badge variant="solid" colorScheme="green">
                    {errors.securityQnA.type}
                  </Badge>
                  <Text>{errors.securityQnA.message}</Text>
                </Stack>
              )}
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
              <Input
                {...register("key")}
                placeholder={`Remember your key : ${rand}`}
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                type="number"
                value={rand}
              />
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
                Already have an account ?{" "}
                <RouterLink to="/login">
                  <Link>Login</Link>
                </RouterLink>
              </Text>
            </Center>
          </Box>
        </Stack>
      </Container>
    </Box>
    <LexBotCommon/>
    </React.Fragment>
  );
}
