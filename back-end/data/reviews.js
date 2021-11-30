//const mongoCollections = require("../config/mongoCollections");
const { reviews } = require("../config/mongoCollections");
const { freelancer } = require("../config/mongoCollections");
const validate = require("./valid");

const { ObjectId } = require("mongodb");

const create = async (data) => {
  const { reviewedBy, reviewFor, title, review, rating } = data;

  validate.checkStr(reviewedBy, "Reviewed By");
  //validation.checkValidObjectId(reviewedBy);
  validate.checkStr(reviewFor, "Review For");
  //validation.checkValidObjectId(reviewFor);
  validate.checkStr(title, "Title");
  validate.checkStr(review, "Review");
  validate.isNumber(rating, "Rating");
  validate.checkRating(rating);

  const reviewCollection = await reviews();

  //Create new review object
  let newReview = {
    reviewedBy: reviewedBy.trim(),
    reviewFor: reviewFor.trim(),
    title: title.trim(),
    review: review.trim(),
    rating: rating,
  };

  //Insert new review object to review collection
  const insertInfo = await reviewCollection.insertOne(newReview);
  if (insertInfo.insertedCount === 0) {
    throw "Could not create review.";
  }

  //Recalculate average rating
  //n let avgRating = await calAvgRating(reviewFor);

  //Fetch objectId for newly created review
  const newId = insertInfo.insertedId;

  const freelanceCollection = await freelancer();

  let freelancerId = ObjectId(reviewFor);

  //Check if the restaurant with the given id exists
  const oneFreelancer = await freelanceCollection.findOne({
    _id: freelancerId,
  });
  if (oneFreelancer === null) {
    throw "No freelancer with that id.";
  }

  let newReviews = oneFreelancer.reviews;

  newReviews.push(newId.toString());

  //Update new review object to review collection
  const updateInfo = await freelanceCollection.updateOne(
    { _id: freelancerId },
    { $set: { reviews: newReviews } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "Could not add review to freelancer";
  }

  //Fetch the newly created review object
  const addedReview = await reviewCollection.findOne({ _id: newId });

  //Convert objectId to string
  addedReview._id = addedReview._id.toString();

  return addedReview;
};

const getAll = async (reviewFor) => {
  let emptyResult = [];
  validate.checkStr(reviewFor, "Review For");

  //validation.checkValidObjectId(reviewFor);
  const reviewCollection = await reviews();

  const reviewList = await reviewCollection
    .find({ reviewFor: reviewFor })
    .toArray();

  //Return an empty array if no freelancer present in the DB
  if (reviewCollection.length <= 0) {
    return emptyResult;
  }

  reviewList.forEach((obj) => {
    //Convert objectId to string
    obj._id = obj._id.toString();
  });

  return reviewList;
};

const get = async (reviewId) => {
  validate.checkStr(reviewId, "Review id");

  //validation.checkValidObjectId(reviewId);

  const reviewCollection = await reviews();

  //Convert id into a valid ObjectID
  let parsedId = ObjectId(reviewId.trim());

  //Check if the review with the given id exists
  const review = await reviewCollection.findOne({ _id: parsedId });
  if (review === null) {
    throw "No review with that id.";
  }

  //Convert ObjectId to string
  review._id = review._id.toString();
  return review;
};

const update = async (
  reviewId,
  reviewedBy,
  reviewFor,
  title,
  review,
  rating
) => {
  validate.checkStr(reviewId, "Review Id");
  //validation.checkValidObjectId(reviewId);

  let parsedId = ObjectId(reviewId.trim());

  const reviewCollection = await reviews();

  //Check if the restaurant with the given id exists
  const existingReview = await reviewCollection.findOne({ _id: parsedId });
  if (existingReview === null) {
    throw "No review with that id.";
  }

  validate.checkStr(reviewedBy, "Reviewed By");
  //validation.checkValidObjectId(reviewedBy);
  validate.checkStr(reviewFor, "Review For");
  //validation.checkValidObjectId(reviewFor);
  validate.checkStr(title, "Title");
  validate.checkStr(review, "Review");
  validate.isNumber(rating, "Rating");
  validate.checkRating(rating);

  if (
    review.reviewedBy == reviewedBy.trim() &&
    review.reviewFor == reviewFor.trim() &&
    review.title == title.trim() &&
    review.review == review.trim() &&
    review.rating == rating
  ) {
    throw "Update field values are the same as the review field values.";
  }

  //Create new review object
  let updateReview = {
    reviewedBy: reviewedBy.trim(),
    reviewFor: reviewFor.trim(),
    title: title.trim(),
    review: review.trim(),
    rating: rating,
  };

  //Update new review object to review collection
  const updateInfo = await reviewCollection.updateOne(
    { _id: parsedId },
    { $set: updateReview }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "Could not update the review.";
  }

  //Recalculate average rating
  let avgRating = await calAvgRating(reviewFor);

  //Fetch the updated review object
  const updatedReview = await reviewCollection.findOne({
    _id: parsedId,
  });

  //Convert objectId to string
  updatedReview._id = updatedReview._id.toString();

  return updatedReview;
};

const remove = async (reviewId) => {
  let result = {};
  validate.checkStr(reviewId, "id");

  //validation.checkValidObjectId(reviewId);

  //Convert id into a valid ObjectID
  let parsedId = ObjectId(reviewId.trim());

  const reviewCollection = await reviews();

  //Check if the restaurant with the given id exists
  const review = await reviewCollection.findOne({ _id: parsedId });
  if (review === null) {
    throw "No review with that id.";
  }

  const deletionInfo = await reviewCollection.deleteOne({ _id: parsedId });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete review with id of ${id}.`;
  }

  result["reviewId"] = review._id.toString();
  result["deleted"] = true;

  return result;
};

//Function to calculate Average rating
async function calAvgRating(productId) {
  let rating = 0;
  validate.checkStr(productId, "Product id");
  //checkValidId(productId);
  //Convert id into a valid ObjectID
  let parsedId = ObjectId(productId.trim());

  const sneakerCollection = await freelancer();

  //Check if the restaurant with the given id exists
  const sneaker = await sneakerCollection.findOne({ _id: parsedId });
  if (sneaker === null) {
    throw "No sneaker with that id.";
  }

  const reviewCollection = await reviews();

  let reviews = sneaker.reviews;
  let overallRating = 0;
  reviews.forEach(async (element) => {
    //Convert id into a valid ObjectID
    let parsedId = ObjectId(element.trim());

    //Check if the review with the given id exists
    const review = await reviewCollection.findOne({ _id: parsedId });
    if (review === null) {
      throw "No review with that id.";
    }
    overallRating += review.rating;
  });

  if (overallRating > 0) {
    overallRating = overallRating / reviews.length;
    overallRating = rating.toFixed(2);
  }

  let updatedSneaker = await sneakerCollection.updateOne(
    { _id: parsedId },
    { $set: { overallRating: overallRating } }
  );

  if (updatedSneaker.modifiedCount === 0 && sneaker.overallRating != rating) {
    throw "Could not update the freelancer rating.";
  } else {
    return true;
  }
}

module.exports = {
  create,
  getAll,
  get,
  update,
  remove,
};
