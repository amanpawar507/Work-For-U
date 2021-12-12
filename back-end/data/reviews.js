const mongoCollections = require("../config/mongoCollections");
const freelancer = mongoCollections.freelancer;
const project = mongoCollections.project;
const { ObjectId } = require("mongodb");
const data = require("../data");
const freelancerData = require("../data/freelancer");
const projectData = require("../data/project");
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
  async create(freelancerId, projectId, title, reviewer, rating, review) {
    if (!freelancerId || !title || !reviewer || !rating || !review)
      throw "All fields need to have valid values";
    if (
      typeof freelancerId != "string" ||
      typeof title != "string" ||
      typeof reviewer != "string" ||
      typeof review != "string" ||
      typeof projectId != "string"
    )
      throw "Input not in string format";
    if (
      freelancerId.trim().length < 1 ||
      title.trim().length < 1 ||
      reviewer.trim().length < 1 ||
      review.trim().length < 1  ||
      projectId.trim().length < 1 
    )
      throw "Input cannot be empty string";
    const check = await freelancerData.getFreelancer(freelancerId);
    if (check === null) throw "Freelancer does not exist";
    const projCheck = await projectData.getProject(projectId);
    if (projCheck === null) throw "Project does not exist";
    if(projCheck.reviewed) throw "Project is already reviewed";
    if (isNaN(rating)) throw "Rating not valid";
    if (rating < 1 || rating > 5) throw "Rating should be between 1-5";
 
    let myId;
    try {
      myId = ObjectId(freelancerId);
      projId = ObjectId(projectId);
    } catch (e) {
      throw "ID not valid";
    }
    const reviewsCollection = await freelancer();
    const projectCollection = await project();
    let newReview = {
      _id: ObjectId(),
      title: title,
      reviewer: reviewer,
      rating: rating,
      dateOfReview: getCurrentTime(),
      review: review,
    };
    const newRating = AverageRating([...check.reviews,newReview]);
    const rev = await reviewsCollection.updateOne(
      { _id: myId },
      { $push: { reviews: newReview } }, { $set: { overallRating: newRating } }
    );
    if (rev.modifiedCount === 0)
      throw "Could not add review for freelancer successfully";
    
    const updateProj = await projectCollection.updateOne({_id: projId},{$set:{reviewed: true}});
    console.log(updateProj);
    if (updateProj.modifiedCount === 0) throw "Could not update project successfully";

    return await projectData.getProject(projectId);
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
