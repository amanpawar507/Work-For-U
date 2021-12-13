import {
  VStack,
  Image,
  Text,
  HStack,
  Button,
  Center,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { getRandomColor } from "../../utils/helper";
import { Rating } from "../common/rating/rateModal";

export const FreelancerCard = ({ name, rating, location, onRequest, id }) => {
  const router = useRouter();

  return (
    <VStack
      w="xs"
      boxShadow={"md"}
      background={"white"}
      textAlign={"left"}
      borderRadius={"5px"}
      overflow={"hidden"}
    >
      <Center
        w={"100%"}
        minH={"200px"}
        bg={getRandomColor()}
        color={"white"}
        cursor={"pointer"}
        onClick={() => router.push(`/freelancer/${id}`)}
      >
        <Heading fontSize={"5xl"} color={"black"}>
          {name
            .split(" ")
            .map((i) => i.split("")[0]?.toUpperCase())
            .join("")}
        </Heading>
      </Center>
      <VStack w={"100%"} padding={"10px"}>
        <Text fontSize={"lg"} w={"100%"}>
          {name}
        </Text>
        <Text fontSize={"lg"} w={"100%"}>
          <Rating rating={rating} disabled />
        </Text>
        <HStack w={"100%"} justifyContent={"space-between"}>
          <Text fontSize={"lg"} w={"100%"}>
            {location}
          </Text>
          <Button
            variant={"outline"}
            colorScheme={"teal"}
            onClick={() => onRequest()}
          >
            Request
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};
