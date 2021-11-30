const express = require("express");
const router = express.Router();
const data = require("../data");
const reviewsData = data.reviews;
const validate = require("../data/valid");

const { ObjectId } = require("mongodb");

router.get("/freelancer/:id", async (req, res) => {
  try {
    validate.checkStr(req.params.id, "Review Id");
    //validation.checkValidObjectId(req.params.id);
    const reviews = await reviewsData.getAll(req.params.id);
    if (reviews.length > 0) {
      res.status(200).json(reviews);
    } else {
      res.status(404).json(reviews);
    }
  } catch (e) {
    res.status(500).json({ Error: e });
  }
});

router.post("/", async (req, res) => {
  const reviewData = req.body;

  try {
    validate.checkStr(reviewData.reviewedBy, "Reviewed By");
    validate.checkStr(reviewData.reviewFor, "Review For");
    validate.checkStr(reviewData.title, "Title");
    validate.checkStr(reviewData.review, "Review");
    validate.isNumber(reviewData.rating, "Rating");
    validate.checkRating(reviewData.rating);
  } catch (e) {
    res.status(400).json({ Error: e });
    return;
  }

  try {
    const review = await reviewsData.create(
      reviewData.reviewedBy,
      reviewData.reviewFor,
      reviewData.title,
      reviewData.review,
      reviewData.rating
    );
    res.status(200).json(review);
  } catch (e) {
    res.status(500).json({ Error: e });
  }
});

router.get("/:id", async (req, res) => {
  try {
    validate.checkStr(req.params.id, "Review Id");
    //validation.checkValidObjectId(req.params.id);
  } catch (e) {
    res.status(400).json({ Error: e });
    return;
  }
  try {
    const review = await reviewsData.get(req.params.id);
    res.status(200).json(review);
  } catch (e) {
    res.status(404).json({ Error: e });
  }
});

router.put("/:id", async (req, res) => {
  const reviewData = req.body;

  try {
    validate.checkStr(req.params.id, "id");
    //validation.checkValidObjectId(req.params.id);
    validate.checkStr(reviewData.reviewedBy, "Reviewed By");
    //validation.checkValidObjectId(reviewData.reviewedBy;
    validate.checkStr(reviewData.reviewFor, "Review For");
    //validation.checkValidObjectId(reviewData.reviewedBy);
    validate.checkStr(reviewData.title, "Title");
    validate.checkStr(reviewData.review, "Review");
    validate.isNumber(reviewData.rating, "Rating");
    validate.checkRating(reviewData.rating);
  } catch (e) {
    res.status(400).json({ Error: e });
    return;
  }

  try {
    await reviewsData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ Error: e });
    return;
  }

  try {
    const review = await reviewsData.update(
      req.params.id,
      reviewData.reviewedBy,
      reviewData.reviewFor,
      reviewData.title,
      reviewData.review,
      reviewData.rating
    );
    res.status(200).json(review);
  } catch (e) {
    res.status(500).json({ Error: e });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    validate.checkStr(req.params.id, "id");
    //validation.checkValidObjectId(req.params.id);
  } catch (e) {
    res.status(400).json({ Error: e });
    return;
  }

  try {
    await reviewsData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ Error: e });
    return;
  }
  try {
    const review = await reviewsData.remove(req.params.id);
    res.status(200).json(review);
  } catch (e) {
    res.status(500).json({ Error: e });
  }
});

module.exports = router;
