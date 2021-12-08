import { Box, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import client from "../../../utils/client";
import { ReviewItem } from "./reviewItem";

export const ReviewList = ({reviews}) => {

    const [allReviews, setAllReviews] = useState([]);

    useEffect(() => {
        if(!reviews) return;
        const getReviewerInfo = async(reviewers) => {
            try {
                const {data} = await client.post(`http://localhost:5000/employer/getList`,{employeridarr: reviewers});
                let finalList = [];

                reviews.forEach(element => {
                    const foundReviewer = data.find(i => i._id === element.reviewer);
                    if(foundReviewer) {
                        finalList.push({
                            ...element,
                            reviewer: foundReviewer
                        })
                    }
                });
                setAllReviews(finalList);
            } catch (error) {   
                console.log(error);
            }
        }

        const reviewers = reviews.map(i => i.reviewer);
        getReviewerInfo(reviewers)
    },[reviews])

    return(
        <Box w={'90%'} maxHeight={'700px'} overflow={'auto'} p={'10px'}>
            <VStack spacing={'20px'}>
                {allReviews.map((i,idx) => <ReviewItem key={idx} review={i.review} reviewer={i.reviewer} rating={i.rating} title={i.title}/>)}
            </VStack>
        </Box>
    )
}