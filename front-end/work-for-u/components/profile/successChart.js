import { Box } from "@chakra-ui/react"
import {Bar, Doughnut} from 'react-chartjs-2';
// import {Chart, ArcElement} from 'chart.js'
// Chart.register(ArcElement);


export const SuccessChart = ({chartInfo}) => {
    
    return (
        <Box>
            {chartInfo && <Doughnut
                data={{
                    labels: chartInfo.labels,
                  datasets: [{
                    data: chartInfo.values,
                    backgroundColor: chartInfo.colors
                  }]
                  }}
                width={400}
                height={400}
            />}

        </Box>
    )
}

export const ProjectChart = ({chartInfo}) => {
    return(
        <Box>
            {chartInfo && <Bar
                data={{
                    labels: chartInfo.labels,
                  datasets: [{
                    label: "Projects by skills",
                    data: chartInfo.values,
                    backgroundColor: chartInfo.colors
                  }]
                  }}
                width={400}
                height={400}
            />}

        </Box>
    )
}