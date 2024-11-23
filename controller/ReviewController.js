import Review from "../model/ReviewSchema.js";
import {joiReviewSchema} from "../model/ValidationSchema.js";
import User from "../model/AuthSchema.js";
import Package from "../model/PackageSchema.js";
import Activity from "../model/ActivitySchema.js";
import PackageBooking from "../model/BookingSchema.js";


export const addReview = async (req, res) => {
  const { value, error } = joiReviewSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "Validation error",
      data: null,
    });
  }

  const { user, package: packageId, activity, rating, reviewText } = value;

  try {
    
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
        data: null,
      });
    }

    
    if (packageId) {
      
      const existingPackage = await Package.findById(packageId);
      if (!existingPackage) {
        return res.status(404).json({
          statusCode: 404,
          message: "Package not found",
          data: null,
        });
      }

      
      const userBooking = await PackageBooking.findOne({ userId: user, packageId });
      if (!userBooking) {
        return res.status(403).json({
          statusCode: 403,
          message: "You can only review a package that you have booked",
          data: null,
        });
      }

      
      const newReview = new Review({
        user,
        package: packageId,
        activity: undefined, 
        rating,
        reviewText,
      });

      await newReview.save();

      
      existingPackage.reviews.push(newReview._id);
      await existingPackage.save();

      return res.status(201).json({
        statusCode: 201,
        message: "Review added successfully for the package",
        data: newReview,
      });
    }

    
    if (activity) {
      const existingActivity = await Activity.findById(activity);
      if (!existingActivity) {
        return res.status(404).json({
          statusCode: 404,
          message: "Activity not found",
          data: null,
        });
      }

      
      const userActivityBooking = await ActivityBooking.findOne({ userId: user, activityId: activity });
      if (!userActivityBooking) {
        return res.status(403).json({
          statusCode: 403,
          message: "You can only review an activity that you have participated in",
          data: null,
        });
      }

    
      const newReview = new Review({
        user,
        package: undefined,
        activity,
        rating,
        reviewText,
      });

      await newReview.save();

      
      existingActivity.reviews.push(newReview._id);
      await existingActivity.save();

      return res.status(201).json({
        statusCode: 201,
        message: "Review added successfully for the activity",
        data: newReview,
      });
    }

  
    return res.status(400).json({
      statusCode: 400,
      message: "You must provide either a package or an activity to review",
      data: null,
    });

  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: null,
    });
  }
};

  

export const getActivityReviews = async (req, res) => {
  const { activityId } = req.params;

  try {
    const reviewCount = await Review.countDocuments({ activity: activityId });

    const reviewDocs = await Review.find({ activity: activityId }).populate(
      "user",
      "name image email"
    );

    if (!reviewDocs || reviewDocs.length === 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "No reviews for this activity",
        data: [],
        dataCount: reviewCount,
        overallRating: 0,
      });
    }

    const totalRating = reviewDocs.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const overallRating = totalRating / reviewCount;

    await Activity.findByIdAndUpdate(activityId, { overallRating });

    return res.status(200).json({
      statusCode: 200,
      message: "Fetched reviews of this activity",
      data: reviewDocs,
      dataCount: reviewCount,
      overallRating: overallRating.toFixed(1),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};

export const getPackageReviews = async (req, res, next) => {
    const { packageId } = req.params;
  
    try {
      
      const packageDoc = await Package.findById(packageId)
        .populate({
          path: 'reviews',
          populate: {
            path: 'user', 
            select: 'name image email', 
          },
        });
        console.log(packageDoc);
        
  
      if (!packageDoc) {
        return res.status(404).json({
          statusCode: 404,
          message: "Package not found",
          data: null,
        });
      }
  
      const reviewCount = packageDoc.reviews.length;
  
      if (reviewCount === 0) {
        return res.status(200).json({
          statusCode: 200,
          message: "No reviews found for this package",
          data: [],
          dataCount: 0,
          overallRating: 0,
        });
      }
  
      const totalRating = packageDoc.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const overallRating = totalRating / reviewCount;
  
      
      packageDoc.overallRating = overallRating;
      await packageDoc.save();
  
      return res.status(200).json({
        statusCode: 200,
        message: "Package with reviews fetched successfully",
        data: packageDoc,
        dataCount: reviewCount,
        overallRating: overallRating.toFixed(1),
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: "Internal server error",
        data: null,
      });
    }
  };

  

export const updateReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { value, error } = joiReviewSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "validation error",
      data: null,
    });
  }

  const { user, package: packageId, activity, rating, reviewText } = value;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        statusCode: 404,
        message: "Review not found",
        data: null,
      });
    }

    if (review.user.toString() !== user) {
      return res.status(403).json({
        statusCode: 403,
        message: "Unauthorized to update this review",
        data: null,
      });
    }

    if (packageId) {
      const existingPackage = await Package.findById(packageId);
      if (!existingPackage) {
        return res.status(404).json({
          statusCode: 404,
          message: "package not found",
          data: null,
        });
      }
    }

    if (activity) {
      const existingActivity = await Activity.findById(activity);
      if (!existingActivity) {
        return res.status(404).json({
          statusCode: 404,
          message: "Activity not found",
          data: null,
        });
      }
    }

    review.package = packageId || review.package;
    review.activity = activity || review.activity;
    review.rating = rating || review.rating;
    review.reviewText = reviewText || review.reviewText;

    await review.save();

    return res.status(200).json({
      statusCode: 200,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};
