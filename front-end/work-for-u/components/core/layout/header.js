import { Button, HStack, IconButton, Input, InputGroup, InputRightElement, Select,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Text,
    Heading,
    FormControl,
    FormLabel,
    Tooltip,
    Flex,
} from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { useContext, useState } from "react";
import { MdBlock, MdLogout, MdMenu, MdMenuOpen, MdPerson, MdSearch } from "react-icons/md";
import logo from '../../../public/WFU.png';
import { UserContext } from "../../contexts/userContext";

export const Header = ({isFreelancer,userInfo}) => {
    const [search,setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const router = useRouter();
    const {pathname} = router;
    const {user} = useContext(UserContext);
    // const isFr
    const handleChange = e => {
        setSearch(e.target.value);
    }

    const handleSearch = () => {
        //debugger;
        if(!search || search.trim().length === 0) return;
        router.push(`/employer/search?q=${search}&&t=${filter}`);
    }

    console.log(pathname.split("/"));

    return(
        <HStack bg={"rgb(245, 245, 245)"} w={'100%'} p ={'10px 0'} justifyContent={'space-between'} top={0} width={'1000px'} position={'fixed'} zIndex={2}>
            <HStack>
                <img src="/WFU.png" width="60" alt='logo'/>
                {/* {<Heading as="h1" bg={'white'} fontSize={'2xl'} mr='20px' display={'flex'} color={'brand.500'}>WF<Text color={'brand.900'}>U</Text></Heading>} */}
               {!isFreelancer && 
               <FormControl display={'flex'} gridGap={'10px'}>
                   <FormLabel hidden htmlFor="search-input">Search</FormLabel>
                    <Input id="search-input" w={'150px'} borderColor={"#BFC0C0"} value={search} onChange={handleChange} placeholder="Search" size="md"  />
                    <FormLabel hidden htmlFor="search-filter">Filter</FormLabel>
                    <Select id="search-filter" value={filter} borderColor={"#BFC0C0"}  onChange={e => setFilter(e.target.value)} variant={'outline'} placeholder='filter' size={'md'} w={'100px'}>
                        <option value="name">name</option>
                        <option value="skill">skill</option>
                        <option value='location'>location</option>
                    </Select>
                    <FormLabel hidden htmlFor="search-btn">Filter</FormLabel>
                    <Tooltip label="Search">
                        <IconButton id="search-btn" icon={<MdSearch/>} onClick={handleSearch}></IconButton>
                    </Tooltip>
               </FormControl>
                }
            </HStack>
            <HStack>
                {user && 
                <Flex mr={'10px'}>
                    <Text fontStyle={'italic'} display={'flex'}>Welcome, </Text>
                    <Text fontStyle={'italic'} ml='4px' color={'black'} fontWeight={'bold'} as="h1">{` ${user.fullName}`}</Text>
                </Flex>}
                <Button background={!pathname.split("/")[2] && 'black'} variant={!pathname.split("/")[2] ? 'solid' : 'ghost'} color={pathname.split("/")[2] ? 'black' : 'white'} onClick={() => router.push(`/${isFreelancer?"freelancer":"employer"}`)}>Dashboard</Button>
                <Button background={pathname.split("/")[2] === "projects" && 'black'} variant={pathname.split("/")[2] === "projects" ? 'solid' : 'ghost'} color={pathname.split("/")[2] !== "projects" ? 'black' : 'white'}  onClick={() => router.push(`/${isFreelancer?"freelancer":"employer"}/projects`)}>Projects</Button>
                <Menu zIndex="999">
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<MdMenuOpen />}
                        color={'black'} 
                        variant="ghost"
                    />
                    <MenuList zIndex={"9999"}>
                        <MenuItem icon={<MdPerson />} onClick={() => router.push(`/${isFreelancer?"freelancer":"employer"}/${userInfo._id}`)}>
                            Profile
                        </MenuItem>
                        {isFreelancer && <MenuItem icon={<MdBlock />} onClick={() => router.push("/freelancer/blacklist")}>
                            Blacklist
                        </MenuItem>}
                        <MenuItem icon={<MdLogout />} onClick={() => router.push(`/logout`)}>
                            Logout
                        </MenuItem>
                    </MenuList>
                </Menu>  
                {/* <Button variant='ghost' onClick={() => router.push(`/${isFreelancer?"freelancer":"employer"}/${userInfo._id}`)}>Profile</Button>
                <Button  variant='ghost' onClick={() => router.push(`/logout`)}>Logout</Button> */}
            </HStack>
        </HStack>
    )
}