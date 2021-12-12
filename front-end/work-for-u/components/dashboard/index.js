import { Button, HStack, useToast } from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
// import axios from 'axios';
import client from "../../utils/client";
import { EmptyAlert } from "../common/emptyAlert";
import { FreelancerList } from "../common/freelancerList";
import { UserContext } from "../contexts/userContext";

export const Dashboard = () => {
  const [listofFreelancers, setListOfFreelancers] = useState([]);
  const [showRecommended, setShowRecommended] = useState(true);

  const { user } = useContext(UserContext);

  const toast = useToast();
  const errorAlert = error => {
    toast({
        title: error.response? 
                error.response.data.error : 
                error.message ? 
                error.message : 
                error,
        status: "error",
        duration: 2000
    });
}

  useEffect(() => {
    if(!user) return;
    const getFreelancers = async () => {
      try {
        if (showRecommended) {
          const { data } = await client.get(
            `http://localhost:5000/freelancer/recommended/${user._id}`
          );
          setListOfFreelancers(data);
        } else {
          const { data } = await client.get(
            "http://localhost:5000/freelancer/all"
          );
          setListOfFreelancers(data);
        }
      } catch (error) {
        console.log(error);
        errorAlert(error);
      }
    };
    getFreelancers();
  }, [user, showRecommended]);

  return (
    user && (
      <>
        <HStack mb="20px">
          <Button
            onClick={() => setShowRecommended(true)}
            variant={!showRecommended && "outline"}
            bg={showRecommended && "brand.900"}
            color={!showRecommended && "black"}
            size={"sm"}
            borderRadius="full"
          >
            Recommended
          </Button>
          <Button
            onClick={() => setShowRecommended(false)}
            variant={showRecommended && "outline"}
            bg={!showRecommended && "brand.900"}
            color={showRecommended && "black"}
            minW={"50px"}
            size={"sm"}
            borderRadius="full"
          >
            All
          </Button>
        </HStack>
        {listofFreelancers.length > 0 ? (
          <FreelancerList list={listofFreelancers} />
        ) : (
          <EmptyAlert text="No freelancers avaialble. Come back later!" />
        )}
      </>
    )
  );
};
