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

export const getRandomColor = () => {
    const colors = [
        "#F1CACA", "#F1DBCA", "#F1EDCA", "#D9F1CA", '#CAF1CC',
        "#CAF1E8", "#CAEDF1", "#CADCF1", "#CCCAF1", "#E5CAF1",
        "#F1CADD", "#F1CACF", "#FE9B93", "#FEBC93", "#FED793",
        "#FEF493", "#E2FE93", "#ABFE93", "#93FEBA", "#93FEEE",
        "#93E1FE", "#C993FE","#FE93DF","#FE93B7"
    ]

    const min = 0;
    const max = colors.length;
    let index = Math.floor(Math.random() * (max - min) + min);
    return colors[index];
}