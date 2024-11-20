import Package from "../model/PackageSchema.js";
import { packageValidationSchema } from "../model/ValidationSchema.js";

export const createPackacge = async (req, res) => {
  const { value, error } = packageValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.details,
      data: null,
    });
  }
  try {
    const newpack = await Package.create({
      ...value,
    });
    res.status(201).json({
      statusCode: 200,
      message: "data created successfully",
      packageId: newpack._id,
      data: newpack,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "internal server error", data: null });
  }
};

export const getallpackage = async (req, res) => {
  try {
    const packages = await Package.find();
    const allpackagecount = await Package.countDocuments();

    if (packages) {
      res.status(200).json({
        statusCode: 200,
        message: "successfully package fetched",
        data: packages,
        datacount: allpackagecount,
      });
    } else {
      return res.status(404).json({
        statusCode: 404,
        message: "packages not available",
        data: null,
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "internal server error", data: null });
  }
};

export const SinglePackage = async (req, res) => {
  const packageid = req.params.id;
  
  

  try {
    const pack = await Package.findById(packageid);
    
    
    if (pack) {
      return res.status(200).json({
        statusCode: 200,
        message: "successfyllt fetched single package",
        data: pack,
      });
    }
    return res.status(404).json({
      statusCode: 404,
      message: "package not found",
      data: null,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "internal server error", data: null });
  }
};
export const updatepackages = async (req, res) => {
  try {
    const { value, error } = packageValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        statusCode: 400,
        message: "validation error",
        data: null,
      });
    }

    const { id } = req.params;

    const updatepackage = await Package.findByIdAndUpdate(
      id,
      { $set: { ...value } },
      { new: true }
    );
    if (updatepackage) {
      return res.status(200).json({
        statusCode: 200,
        message: "Successfully updated data",
        data: updatepackage,
      });
    } else {
      return next(trycatchmidddleware(404, error.message));
    }
  } catch (error) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "internal server error", data: null });
  }
};

export const deletepackage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPackage = await Package.findByIdAndDelete(id);
    if (!deletedPackage) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Package not found", data: null });
    }

    res
      .status(200)
      .json({
        statusCode: 200,
        message: "Package deleted successfully",
        data: deletedPackage,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "internal server error", data: null });
  }
};
