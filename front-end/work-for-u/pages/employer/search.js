import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { useContext, useEffect, useState } from "react";
import { Layout } from "../../components";
import { UserContext } from "../../components/contexts/userContext";
import { Search } from "../../components/search";
import client from "../../utils/client";

const SearchPage = () => {
  const { query,push } = useRouter();
  const toast = useToast();
  const [results, setResults] = useState([]);

  const {isFreelancer} = useContext(UserContext);

  useEffect(() => {
    if (!query) return;
    const searching = async (req) => {
      try {
        const { data } = await client.post(
          "http://localhost:5000/freelancer/searchFreelancer",
          req
        );
        console.log(data);
        setResults(data);
      } catch (error) {
        console.log(error.response.data);
        toast({
          title: error.response.data
            ? error.response.data.error
            : error.message,
          status: "error",
          duration: 2000,
        });
      }
    };
    const { q, t } = query;
    if (!q || !t) return;
    console.log(q, t);
    const req = {
      query: q,
      filterkey: t,
    };

    if(isFreelancer !== undefined && isFreelancer !== null) {
      debugger;
      if(isFreelancer) {
        push("/freelancer");
      }else{
        searching(req);
      }
    }

  }, [query,isFreelancer]);
  return (
    <Layout>
      <Search query={query && query.q} results={results} />
    </Layout>
  );
};

export default SearchPage;
