const mongoose = require("mongoose");
const User = require("./userModel");
const Tour = require("./tourModel");

// Define the Review schema
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review cannot be empty"],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre middleware to populate user and tour data
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "tour",
    select: "name ratingsAverage", // Select only the name and ratingsAverage fields
  }).populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// Static method to calculate average ratings
reviewSchema.statics.calcAverageRatings = async function (tourId) {
   // Convert tourId to ObjectId
  objectId = new mongoose.Types.ObjectId(tourId);
  const stats = await this.aggregate([
    {
      $match: { tour: objectId }, // Match reviews with the given tourId
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // Update the tour with the calculated average ratings
  if (stats.length > 0) {
    const result=await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
    console.log(result)
  } else {
    // Set defaults if no reviews exist
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
// Post-save middleware to calculate average ratings after saving a review
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.tour);
});

// Pre middleware to get the review to get its tour before updating/deleting 
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.model.findOne(this.getQuery()).exec(); // Execute the query and store the document
  next();
});

// Post middleware to calculate average ratings after update/delete (by the tour saved )
reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.tour);
  }
});

//One Review for the user on one tour
reviewSchema.index({user:1,tour:1},{unique:true});

// Create the Review model
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
