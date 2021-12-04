import { useState, useEffect } from "react";
import { HStack, toast, useDisclosure, useToast } from "@chakra-ui/react";
import { FreelancerCard } from "./freelancerCard";
import axios from "axios";
import { RequestModal } from "./requestModal";
import { Heading } from "@chakra-ui/react";

export const Dashboard = () => {
  const [listofFreelancers, setListOfFreelancers] = useState([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    const searchType = async () => {
      const { data } = await axios.get("http://localhost:5000/freelancer/all");
      setListOfFreelancers(data);
    };
    searchType();
  }, []);

  const handleRequestOpen = (freelancer) => {
    setSelectedFreelancer(freelancer);
    onOpen();
  };

  return (
    <>
      <Heading>I'm a Heading</Heading>
      <HStack spacing={"20px"}>
        {listofFreelancers.map((i) => (
          <FreelancerCard
            name={i.fullName}
            rating={i.overallRating}
            skill={
              i.skills[Math.floor(Math.random() * i.skills.length - 1) + 1].name
            }
            onRequest={() => handleRequestOpen(i)}
          />
        ))}
      </HStack>
      <RequestModal
        isOpen={isOpen}
        onClose={() => onClose()}
        selectedFreelancer={selectedFreelancer}
      />
    </>
  );
};
