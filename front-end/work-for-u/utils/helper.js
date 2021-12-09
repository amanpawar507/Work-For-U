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