import { Heading, Text } from "@chakra-ui/react";
import { FreelancerList } from "../common/freelancerList";

export const Search = ({ query, results }) => {
  return (
    <>
      <Text display={"flex"} fontSize={"xl"}>
        Search results for{" "}
        <Heading fontSize="2xl" ml="5px">{`  "${query}"`}</Heading>
      </Text>
      <br />
      <FreelancerList list={results} />
    </>
  );
};
