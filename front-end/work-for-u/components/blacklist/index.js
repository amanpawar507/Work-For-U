import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  useToast,
  Avatar,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { useContext, useEffect, useState } from "react";
import client from "../../utils/client";
import { CustomAvatar } from "../common/Avatar";
import { EmptyAlert } from "../common/emptyAlert";
import { UserContext } from "../contexts/userContext";

export const Blacklist = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useContext(UserContext);

  const toast = useToast();

  const router = useRouter();

  useEffect(() => {
    if (!user || !user.blacklist || user.blacklist.length === 0) {
      setDetails([]);
      return;
    }
    const getEmployersInfo = async (arr) => {
      try {
        const { data } = await client.post(
          "http://localhost:5000/employer/getList",
          { employeridarr: arr }
        );
        setDetails(data);
      } catch (error) {
        toast({
          title: "Could not fetch employers info",
          status: "error",
          duration: 2000,
        });
      }
    };
    getEmployersInfo(user.blacklist);
  }, [user]);

  const unBlock = async (employer) => {
    try {
      setLoading(true);
      const { data } = await client.delete(
        `http://localhost:5000/freelancer/blacklist/${user._id}/${employer._id}`
      );
      //console.log(data);
      setUser(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Could not remove the employer from list",
        status: "error",
        duration: 2000,
      });
    }
  };

    return(
        <Box>
            {details.length > 0 ? 
            <table className="blacklist-table">
                <thead>
                    <tr>
                    <th>Profile</th>
                    <th>Employer</th>
                    <th>Action</th>
                    </tr>
                </thead>
                    {
                        details.map((i,idx) => 
                        <tr key={idx}> 
                            <td><CustomAvatar cursor={'pointer'} isFreelancer={false} id={i._id} name={i.fullName}/></td>
                            <td>{i.fullName}</td>
                            <td><Button colorScheme={'teal'} variant={'outline'} isLoading={loading} onClick={() => unBlock(i)}>Remove</Button></td>
                        </tr>
                        )
                    }
            </table> :
            <EmptyAlert text="You haven't blacklisted anyone yet"/>
            }
        </Box>
    )
}
