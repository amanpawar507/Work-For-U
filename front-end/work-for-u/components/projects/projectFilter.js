import { Button, FormControl, FormLabel, Input, Select, VStack } from "@chakra-ui/react"
import { useState } from "react"

export const ProjectFilter = ({handleFilter,handleClearFilter}) => {
    const [type,setType] = useState(null);
    const [query,setQuery] = useState("")


    return(
        <VStack>
            <FormControl>
                <FormLabel htmlFor="project-filter-type">Filter Type</FormLabel>
                <Select id="project-filter-type" value={type}  onChange={e => {setType(e.target.value.trim() !== "" ? e.target.value : null)}}>
                    <option value={null}>Filter Type</option>
                    <option value="name">Name</option>
                    <option value="skill">Skill</option>
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel htmlFor="project-query">Query</FormLabel>
                <Input id="project-query" value={query} onChange={e => setQuery(e.target.value)} placeholder="Query" isRequired/>
                <Button m="10px 0" w={'100%'} color={"black"} onClick={() => {query.trim().length > 0 && handleFilter({type,query})}}>Filter</Button>
                <Button w={'100%'} color={"black"} onClick={() => {setType(null); setQuery(""); handleClearFilter();}}>Clear Filter</Button>
            </FormControl>
        </VStack>
    )
}