import { Box, Grid, HStack, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import client from "../../../utils/client";
import { ReviewItem } from "./reviewItem";

export const ReviewList = ({ reviews, user, owner, handleDelete }) => {
  const [allReviews, setAllReviews] = useState([]);

  useEffect(() => {
    if (!reviews) return;
    const getReviewerInfo = async (reviewers) => {
      try {
        const { data } = await client.post(
          `http://localhost:5000/employer/getList`,
          { employeridarr: reviewers }
        );
        let finalList = [];

        reviews.forEach((element) => {
          const foundReviewer = data.find((i) => i._id === element.reviewer);
          if (foundReviewer) {
            finalList.push({
              ...element,
              reviewer: foundReviewer,
            });
          }
        });
        setAllReviews(finalList);
      } catch (error) {
        //console.log(error);
      }
    };

    const reviewers = reviews.map((i) => i.reviewer);
    getReviewerInfo(reviewers);
  }, [reviews]);

  // useEffect(() => {
  //     console.log(user);
  //     console.log(reviews);
  //     console.log(user._id === allReviews[0].reviewer)
  // },[user, reviews]);

  return (
    <Box w={"100%"} maxHeight={"700px"} overflow={"auto"} p={"10px"}>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        {allReviews.map((i, idx) => (
          <ReviewItem
            key={idx}
            review={i.review}
            reviewer={i.reviewer}
            date={i.dateOfReview}
            rating={i.rating}
            title={i.title}
            canDelete={owner || user._id === i.reviewer._id}
            handleDelete={() => handleDelete(i._id, i.reviewedFor)}
          />
        ))}
      </Grid>
    </Box>
  );
};
