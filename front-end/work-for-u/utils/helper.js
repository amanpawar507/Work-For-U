import { useToast } from "@chakra-ui/react"
import { format, isDate } from "date-fns"

export const getStatus = status => {
    switch (status) {
        case 0:
            return "open"
        case 1:
            return "assigned"
        case 2:
            return "ongoing"
        case 3: 
            return "completed"
        case 4: 
            return "incomplete"
        default:
            break;
    }
}

export const getColorScheme = status => {

    switch (status) {
        case 0:
            return "gray"
        case 1:
            return "orange"
        case 2:
            return "yellow"
        case 3:
            return "green"
        case 4:
            return "red"
        default:
            break;
    }
}

export const emailValidation = email => {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) return false;
    return true;
}

export const getDateFormat = date => {
        const formatdate = new Date(date)
        if (!isDate(formatdate)) return
        return format(formatdate, 'dd/MM/yyyy')
}