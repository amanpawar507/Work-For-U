import { Button, Input, Select, VStack } from "@chakra-ui/react"
import { useState } from "react"

export const ProjectFilter = ({handleFilter,handleClearFilter}) => {
    const [type,setType] = useState(null);
    const [query,setQuery] = useState("")


    return(
        <VStack>
            <Select value={type} onChange={e => setType(e.target.value)} placeholder="Filter Type">
                <option value="name">Name</option>
                <option value="skill">Skill</option>
            </Select>
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Query"/>
            <Button w={'100%'} onClick={() => handleFilter({type,query})}>Filter</Button>
            <Button w={'100%'} onClick={() => {setType(null); setQuery(""); handleClearFilter();}}>Clear Filter</Button>
        </VStack>
    )
}