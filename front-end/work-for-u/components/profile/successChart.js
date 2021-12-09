import { Box } from "@chakra-ui/react"
import {Doughnut} from 'react-chartjs-2';
// import {Chart, ArcElement} from 'chart.js'
// Chart.register(ArcElement);


export const SuccessChart = ({chartInfo}) => {
    
    // const data = {
    //     labels: [
    //         'Red',
    //         'Green',
    //         'Yellow'
    //     ],
    //     datasets: [{
    //         data: [300, 50, 100],
    //         backgroundColor: [
    //         '#FF6384',
    //         '#36A2EB',
    //         '#FFCE56'
    //         ],
    //         hoverBackgroundColor: [
    //         '#FF6384',
    //         '#36A2EB',
    //         '#FFCE56'
    //         ]
    //     }]
    // };
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

