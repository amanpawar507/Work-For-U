const mongoCollections = require("../config/mongoCollections");
const freelancer = mongoCollections.freelancer;
const { ObjectId } = require("mongodb");
const data = require("../data");
const freelancerData = require("../data/freelancer");
const { reviews } = require("../data");

const getCurrentTime = () => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  return dateTime;
};

function AverageRating(reviews) {
  if (reviews.length == 0) {
    return 0;
  } else {
    let avg = 0;
    let count = 0;
    for (element of reviews) {
      avg = avg + element.rating;
      count++;
    }
    avg = avg / count;
    return Number(avg.toFixed(2));
  }
}

module.exports = {
  async create(freelancerId, title, reviewer, rating, review) {
    if (!freelancerId || !title || !reviewer || !rating || !review)
      throw "All fields need to have valid values";
    if (
      typeof freelancerId != "string" ||
      typeof title != "string" ||
      typeof reviewer != "string" ||
      typeof review != "string"
    )
      throw "Input not in string format";
    if (
      freelancerId.trim().length < 1 ||
      title.trim().length < 1 ||
      reviewer.trim().length < 1 ||
      review.trim().length < 1
    )
      throw "Input cannot be empty string";
    const check = freelancerData.getFreelancer(freelancerId);
    if (check == null) throw "Freelancer does not exist";
    if (isNaN(rating)) throw "Rating not valid";
    if (rating < 1 || rating > 5) throw "Rating should be between 1-5";
    //let today = new Date();
    // let dateParameter = new Date(dateOfReview);
    // if (dateParameter == "Invalid Date") throw "Date is not valid";
    // if (
    //   dateParameter.getDate() != today.getDate() ||
    //   dateParameter.getMonth() != today.getMonth() ||
    //   dateParameter.getFullYear() != today.getFullYear()
    // )
    // throw "Date should be valid and today's date";
    let myId;
    try {
      myId = ObjectId(freelancerId);
    } catch (e) {
      throw "ID not valid";
    }
    const reviewsCollection = await freelancer();
    let newReview = {
      _id: ObjectId(),
      title: title,
      reviewer: reviewer,
      rating: rating,
      dateOfReview: getCurrentTime(),
      review: review,
    };

    const rev = await reviewsCollection.updateOne(
      { _id: myId },
      { $push: { reviews: newReview } }
    );
    if (rev.modifiedCount === 0)
      throw "Could not add review for freelancer successfully";
    const check1 = await freelancerData.getFreelancer(freelancerId);
    const newRating = AverageRating(check1.reviews);
    await reviewsCollection.updateOne(
      { _id: myId },
      { $set: { overallRating: newRating } }
    );

    return await freelancerData.getFreelancer(freelancerId);
  },

  async getAll(freelancerId) {
    if (!freelancerId) throw "Freelancer Id must be provided";
    if (typeof freelancerId != "string") throw "Input not in string format";
    if (freelancerId.trim().length < 1) throw "Input cannot be empty string";
    let myId;
    try {
      myId = ObjectId(freelancerId);
    } catch (e) {
      throw "ID not valid";
    }

    const check2 = await freelancerData.getFreelancer(freelancerId);
    if (check2 == null) throw "Freelancer does not exist";

    return check2.reviews;
  },

  async get(reviewId) {
    if (!reviewId) throw "Review Id must be provided";
    if (typeof reviewId != "string") throw "Input not in string format";
    if (reviewId.trim().length < 1) throw "Input cannot be empty string";
    let revID;
    try {
      revID = ObjectId(reviewId);
    } catch (e) {
      throw "ID not valid";
    }
    const reviewsCollection = await freelancer();
    const check3 = await reviewsCollection.findOne({ "reviews._id": revID });
    if (check3 == null) throw "Freelancer does not exist";
    for (element of check3.reviews) {
      if (element._id == reviewId) {
        return element;
      }
    }
    //check3._id = check3._id.toString();
    //return check3;
  },

  async remove(reviewId) {
    if (!reviewId) throw "Review Id must be provided";
    if (typeof reviewId != "string") throw "Input not in string format";
    if (reviewId.trim().length < 1) throw "Input cannot be empty string";
    const check = this.get(reviewId);
    if (check == null) throw "Review does not exist";
    let revID;
    try {
      revID = ObjectId(reviewId);
    } catch (e) {
      throw "ID not valid";
    }

    const freelancerCollection = await freelancer();
    const check3 = await freelancerCollection.findOne({
      "reviews._id": revID,
    });
    const deletionInfo1 = await freelancerCollection.updateOne(
      { "reviews._id": revID },
      { $pull: { reviews: { _id: revID } } }
    );
    if (deletionInfo1.modifiedCount === 0)
      throw `Could not delete review with id of ${reviewId}`;
    const newCheck3 = await freelancerCollection.findOne({ _id: check3._id });
    const newRating = AverageRating(newCheck3.reviews);
    await freelancerCollection.updateOne(
      { _id: check3._id },
      { $set: { overallRating: newRating } }
    );

    return { reviewId: reviewId, deleted: true };
  },
};
