import { Input, FormLabel} from "@chakra-ui/react"

export const InputComp = ({name,onChange,label,value,type,required}) => {
    return(
       <>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <Input size='sm' id={name} type={type?type:"text"} value={value} name={name} onChange={e => onChange(e)} placeholder={name} isRequired={required}/>
       </>
    )
}