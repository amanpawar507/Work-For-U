import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components";
import { Search } from "../../components/search";

const SearchPage = () => {
  const { query } = useRouter();
  const toast = useToast();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    const searching = async (req) => {
      try {
        const { data } = await axios.post(
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
    searching(req);
  }, [query]);
  return (
    <Layout>
      <Search query={query && query.q} results={results} />
    </Layout>
  );
};

export default SearchPage;
