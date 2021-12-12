const express = require("express");
const router = express.Router();
const data = require("../data");
const reData = data.reviews;

const freelancerData = data.freelancer;
const projectData = data.project;

router.post("/:freelancerId/:projectId", async (req, res) => {
  const reviewData = req.body;

  try {
    if (
      !reviewData.title ||
      !reviewData.reviewer ||
      !reviewData.rating ||
      !reviewData.review 
    )
      throw "All fields need to have valid values";
    if (
      typeof req.params.freelancerId != "string" ||
      typeof req.params.projectId != "string" ||
      typeof reviewData.title != "string" ||
      typeof reviewData.reviewer != "string" ||
      typeof reviewData.review != "string"
    )
      throw "Input not in string format";
    if (
      req.params.freelancerId.trim().length < 1 ||
      req.params.projectId.trim().length < 1 ||
      reviewData.title.trim().length < 1 ||
      reviewData.reviewer.trim().length < 1 ||
      reviewData.review.trim().length < 1
    )
      throw "Input cannot be empty string";
    if (isNaN(reviewData.rating)) throw "Rating not valid";
    if (reviewData.rating < 1 || reviewData.rating > 5)
      throw "Rating should be between 1-5";
    // let today = new Date();
    // let dateParameter = new Date(reviewData.dateOfReview);
    // if (dateParameter == "Invalid Date") throw "Date is not valid";
    // if (
    //   dateParameter.getDate() != today.getDate() ||
    //   dateParameter.getMonth() != today.getMonth() ||
    //   dateParameter.getFullYear() != today.getFullYear()
    // )
    //   throw "Date should be valid and today's date";
  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }

  try {
    const { title, reviewer, rating, review } = reviewData;
    const newPost = await reData.create(
      req.params.freelancerId,
      req.params.projectId,
      title,
      reviewer,
      rating,
      review
    );
    res.status(200).json(newPost);
  } catch (e) {
    console.log(e);
    res.status(404).json({ error: e });
  }
});

router.get("/:freelancerId", async (req, res) => {
  try {
    if (!req.params.freelancerId) throw "Restaurant Id must be provided";
    if (typeof req.params.freelancerId != "string")
      throw "Input not in string format";
    if (req.params.freelancerId.trim().length < 1)
      throw "Input cannot be empty string";

    const check2 = await freelancerData.getFreelancer(req.params.freelancerId);
    if (check2 == null) throw "Restaurant does not exist";
  } catch (e) {
    res.status(404).json({ error: e });
  }

  try {
    const reviewl = await reData.getAll(req.params.freelancerId);
    res.status(200).json(reviewl);
  } catch (e) {
    res.status(404).json({ error: "e" });
  }
});

router.get("/review/:reviewId", async (req, res) => {
  try {
    if (!req.params.reviewId) throw "Review Id must be provided";
    if (typeof req.params.reviewId != "string")
      throw "Input not in string format";
    if (req.params.reviewId.trim().length < 1)
      throw "Input cannot be empty string";
  } catch (e) {
    res.status(404).json({ Error: "e" });
  }
  try {
    const review1 = await reData.get(req.params.reviewId);
    res.status(200).json(review1);
  } catch (e) {
    res
      .status(404)
      .json({ Error: "No review found with that ID" + req.params.reviewId });
  }
});

router.delete("/:reviewId", async (req, res) => {
  try {
    if (!req.params.reviewId) throw "Review Id must be provided";
    if (typeof req.params.reviewId != "string")
      throw "Input not in string format";
    if (req.params.reviewId.trim().length < 1)
      throw "Input cannot be empty string";
    const check = reData.get(req.params.reviewId);
    if (check == null) throw "Review does not exist";
  } catch (e) {
    res.status(404).json({ Error: "e" });
  }
  try {
    await reData.remove(req.params.reviewId);
    res.status(200).json({ reviewID: req.params.reviewId, deleted: true });
  } catch (e) {
    res.status(404).json({ Error: e });
  }
});

module.exports = router;
