import { Input, FormLabel, FormControl} from "@chakra-ui/react"

export const InputComp = ({name,onChange,label,value,type,required}) => {
    return(
       <FormControl>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <Input size='sm' id={name} type={type?type:"text"} value={value} name={name} onChange={e => onChange(e)} placeholder={name} isRequired={required}/>
       </FormControl>
    )
}