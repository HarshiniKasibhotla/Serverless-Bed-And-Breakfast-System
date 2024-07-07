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
import React, { useState } from "react";

export default function Suggestions() {

  const [tour, setTour] = useState({ name: "Tour one", days: "10" });

  const tours = [
    { name: "Tour one", days: "10" },
    { name: "Tour two", days: "8" },
  ];

  return (
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
            Based on your last book
            <Text
              as={"span"}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
            >
              i
            </Text>
            ng
          </Heading>
          <Stack isInline spacing={8} align="center">
            {tours.length > 0 &&
              tours.map((tour, index) => {
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
                    </Box>
                  );
                }
              })}
          </Stack>
          <Stack isInline spacing={8} align="center">
            {tours.length >= 3 &&
              tours.map((tour, index) => {
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
              Try that tour
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
          <Box as={"form"} mt={10}>
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
                value={tour.name}
                type="text"
              />
              <Input
                placeholder="How many people"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                type="number"
                // onChange={e => setCount(e.target.value)}
              />
              <Input
                readOnly
                placeholder="Price"
                bg={"gray.100"}
                border={0}
                color={"gray.500"}
                _placeholder={{
                  color: "gray.500",
                }}
                type="number"
                // onChange={e => setCount(e.target.value)}
              />
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
            >
              Submit
            </Button>
          </Box>
          form
        </Stack>
      </Container>
    </Box>
  );
}
