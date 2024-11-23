import Activity from "../model/ActivitySchema.js";
import { activityValidationSchema } from "../model/ValidationSchema.js";

//create activities

export const createActivity = async (req, res) => {
  const { value, error } = activityValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.details,
      data: null,
    });
  }

  try {
    const newActivity = await Activity.create({ ...value });

    res.status(201).json({
      statusCode: 201,
      message: "Activity created successfully",
      activityId: newActivity._id,
      data: newActivity,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};

//getallactivities

export const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    const activitiesCount = await Activity.countDocuments();

    if (activities) {
      res.status(200).json({
        statusCode: 200,
        message: "Successfully fetched activities",
        data: activities,
        datacount: activitiesCount,
      });
    } else {
      return res.status(404).json({
        statusCode: 404,
        message: "No activities available",
        data: null,
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};

//get single acitivites

export const getSingleActivity = async (req, res) => {
  const { id } = req.params;

  try {
    const activity = await Activity.findById(id);

    if (activity) {
      return res.status(200).json({
        statusCode: 200,
        message: "Successfully fetched activity",
        data: activity,
      });
    }
    return res.status(404).json({
      statusCode: 404,
      message: "Activity not found",
      data: null,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};

//update activitis

export const updateActivity = async (req, res) => {
  const { value, error } = activityValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "Validation error",
      data: null,
    });
  }

  try {
    const { id } = req.params;

    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      { $set: { ...value } },
      { new: true }
    );

    if (updatedActivity) {
      return res.status(200).json({
        statusCode: 200,
        message: "Successfully updated activity",
        data: updatedActivity,
      });
    }

    return res.status(404).json({
      statusCode: 404,
      message: "Activity not found",
      data: null,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};
//delete activities
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedActivity = await Activity.findByIdAndDelete(id);

    if (!deletedActivity) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Activity not found", data: null });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Activity deleted successfully",
      data: deletedActivity,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};

export const searchActivities = async (req, res) => {
  try {
    const { name, minPrice, maxPrice, duration, date } = req.query;

    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (duration) {
      query.duration = { $regex: duration, $options: "i" };
    }
    if (date) {
      query.date = new Date(date);
    }

    const activities = await Activity.find(query);

    if (activities.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "No activities found matching your criteria",
        data: null,
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Successfully fetched activities",
      data: activities,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};
