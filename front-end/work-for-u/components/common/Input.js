import { Input, FormLabel, FormControl, FormHelperText} from "@chakra-ui/react"

export const InputComp = ({name,onChange,label,value,type,required,helper}) => {
    return(
       <FormControl isRequired={required}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <Input size='sm' id={name} type={type?type:"text"} value={value} name={name} onChange={e => onChange(e)} placeholder={name} isRequired={required}/>
        {helper && <FormHelperText color={'black'}>{helper}</FormHelperText>}
       </FormControl>
    )
}