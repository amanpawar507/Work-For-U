import { Heading, Text } from "@chakra-ui/react";
import { EmptyAlert } from "../common/emptyAlert";
import { FreelancerList } from "../common/freelancerList";

export const Search = ({ query, results }) => {
  return (
    <>
      <Text display={"flex"} fontSize={"xl"}>
        Search results for{" "}
        <Heading fontSize="2xl" ml="5px">{`  "${query}"`}</Heading>
      </Text>
      <br />
      {results.length > 0 ? <FreelancerList list={results} /> : <EmptyAlert text={"No results found!"}/>} 
    </>
  );
};
