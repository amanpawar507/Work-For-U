import {
  HStack,
  SimpleGrid,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  Button,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FreelancerCard } from "../dashboard/freelancerCard";
import { RequestModal } from "../dashboard/requestModal";

export const FreelancerList = ({ list }) => {
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [resultList, setResultList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!list) return;
    setResultList(list);
  }, [list]);

  const handleRequestOpen = (freelancer) => {
    setSelectedFreelancer(freelancer);
    onOpen();
  };

  const handleRatingSort = (e) => {
    const { value } = e.target;
    let current = [];
    switch (value) {
      case "ascRating":
        current = list.sort((a, b) => {
          return a.overallRating - b.overallRating;
        });
        break;
      case "descRating":
        current = list.sort((a, b) => {
          return b.overallRating - a.overallRating;
        });
        break;
      case "ascSuccess":
        current = list.sort((a, b) => {
          return a.successRate - b.successRate;
        });
        break;
      case "descSuccess":
        current = list.sort((a, b) => {
          return b.successRate - a.successRate;
        });
        break;
      default:
        break;
    }
    setResultList([...current]);
  };

  return (
    <>
      <Select placeholder="Sort By" w={"200px"} onChange={handleRatingSort}>
        <option value="ascRating">Low to High Rating</option>
        <option value="descRating">High to Low Rating</option>
        <option value="ascSuccess">Low to High Success Rate</option>
        <option value="descSuccess">High to Low Success Rate</option>
      </Select>

      <SimpleGrid mt="10px" columns={[2, null, 3]} spacing="40px">
        {resultList.map((i) => (
          <FreelancerCard
            id={i._id}
            name={i.fullName}
            rating={i.overallRating}
            location={i.location}
            onRequest={() => handleRequestOpen(i)}
          />
        ))}
      </SimpleGrid>
      <RequestModal
        isOpen={isOpen}
        onClose={() => onClose()}
        selectedFreelancer={selectedFreelancer}
      />
    </>
  );
};
