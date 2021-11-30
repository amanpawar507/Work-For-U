//check for valid id
function checkValidObjectId(id) {
  if (!ObjectId.isValid(id)) {
    throw "Invalid id.";
  }
}

//check overall rating
function checkRating(myRating) {
  if (myRating < 1 || myRating > 5) {
    throw "Invalid rating.";
  }
}

//check for valid number
function isNumber(num, variable) {
  if (typeof num != "number") {
    throw `${variable || "Given variable"} is not a valid number`;
  }
  if (isNaN(num)) {
    throw `${variable || "Given variable"} is NaN`;
  }
}

//check for Input array
function checkStr(str, variable) {
  if (str == undefined) {
    throw `${variable || "Input string"} is undefined.`;
  }
  if (typeof str != "string") {
    throw `${variable || "Given variable"} is not a valid string.`;
  }
  if (str.trim().length == 0) {
    throw `${variable || "Input string"} is empty.`;
  }
}

//check for valid string
function checkIsChar(str, variable) {
  if (typeof str != "string") {
    throw `${variable || "Given variable"} is not a valid string.`;
  }
}

module.exports = {
  checkValidObjectId,
  checkRating,
  checkStr: checkStr,
  isNumber,
};
