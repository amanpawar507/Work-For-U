import { Button, FormControl, FormLabel, Input, Select, VStack } from "@chakra-ui/react"
import { useState } from "react"

export const ProjectFilter = ({handleFilter,handleClearFilter}) => {
    const [type,setType] = useState(null);
    const [query,setQuery] = useState("")


    return(
        <VStack>
            <FormControl>
                <FormLabel htmlFor="project-filter-type">Filter Type</FormLabel>
                <Select id="project-filter-type" value={type} onChange={e => setType(e.target.value)} placeholder="Filter Type">
                    <option value="name">Name</option>
                    <option value="skill">Skill</option>
                </Select>
                <FormLabel htmlFor="project-query">Filter Type</FormLabel>
                <Input id="project-query" value={query} onChange={e => setQuery(e.target.value)} placeholder="Query"/>
                <Button m="10px 0" w={'100%'} color={"black"} onClick={() => handleFilter({type,query})}>Filter</Button>
                <Button w={'100%'} color={"black"} onClick={() => {setType(null); setQuery(""); handleClearFilter();}}>Clear Filter</Button>
            </FormControl>
        </VStack>
    )
}