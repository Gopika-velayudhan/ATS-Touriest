import Package from "../model/PackageSchema.js";
import { packageValidationSchema } from "../model/ValidationSchema.js";
import User from '../model/AuthSchema.js'

//create package

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

//getallpackage

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

//dinglepackage

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

//updatepackage

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
      return res.status(404).json({
        statusCode: 404,
        message: "package not found",
        data: null,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ statusCode: 500, message: error, data: null });
  }
};

//deletepackage

export const deletepackage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPackage = await Package.findByIdAndDelete(id);
    if (!deletedPackage) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "Package not found", data: null });
    }

    res.status(200).json({
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

export const searchPackages = async (req, res) => {
  const { country, date, budget, membersCount } = req.query;

  const dateRange = date ? date.split(",") : [];
  const budgetRange = budget ? budget.split(",") : [];
  const membersRange = membersCount ? membersCount.split(",") : [];

  try {
    let query = {};

    if (country) {
      query.destination = country;
    }

    if (dateRange.length === 2) {
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
          statusCode: 400,
          message: "Invalid date range format",
          data: null,
        });
      }

      query.startDate = { $gte: startDate };
      query.endDate = { $lte: endDate };
    }

    if (budgetRange.length === 2) {
      const minBudget = Number(budgetRange[0]);
      const maxBudget = Number(budgetRange[1]);

      if (isNaN(minBudget) || isNaN(maxBudget)) {
        console.log("Invalid budget range:", { minBudget, maxBudget });
        return res.status(400).json({
          statusCode: 400,
          message: "Invalid budget range format",
          data: null,
        });
      }

      query.price = { $gte: minBudget, $lte: maxBudget };
    }

    if (membersRange.length === 2) {
      const minMembers = Number(membersRange[0]);
      const maxMembers = Number(membersRange[1]);

      if (isNaN(minMembers) || isNaN(maxMembers)) {
        console.log("Invalid members count range:", { minMembers, maxMembers });
        return res.status(400).json({
          statusCode: 400,
          message: "Invalid members count range format",
          data: null,
        });
      }

      query.availableSeats = { $gte: minMembers, $lte: maxMembers };
    }

    const packages = await Package.find(query);

    if (packages.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "No packages found matching the search criteria",
        data: null,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Successfully fetched packages",
      data: packages,
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 400,
      message: err.message,
      data: null,
    });
  }
};

export const Wishlist = async (req, res) => {
  const userid = req.params.id;
  if (!userid) {
    return res.status(404).json({
      statusCode:404,
      message:"user not found",
      data:null
    })
  }

  try {
    const { packageid } = req.body;
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({
        statusCode:404,
        message:"user not found",
        data:null
      })
    }

    const findpack = await User.findOne({ _id: userid, wishlist: packageid });
    if (findpack) {
      return res.status(404).json({
        statusCode:404,
        message:"the package already exist in wishlist",
        data:null
      })
    }

    const updatewishlist = await User.updateOne(
      { _id: userid },
      { $push: { wishlist: packageid } }
    );
    console.log(updatewishlist);
    

    return res.status(201).send({
      statusCode: 201,
      message: "successfully added package in wishlist",
      data: updatewishlist,
    });
  } catch (err) {
    return res
    .status(500)
    .json({ statusCode: 500, message: "internal server error", data: null });
  }
};

export const showwishlist = async (req, res) => {
  const userid = req.params.id;
  try {
    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({
        statusCode:404,
        message:"user not found",
        data:null
      })
    }

    const wishlistpack = user.wishlist;
    const allwishCount = wishlistpack.length;

    if (allwishCount === 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "Wishlist is empty",
        data: [],
        datacount: allwishCount,
      });
    }

    const wishpack = await Package.find({ _id: { $in: wishlistpack } });

    res.status(200).json({
      statusCode: 200,
      message: "Wishlist packages fetched successfully",
      data: wishpack,
      datacount: allwishCount,
    });
  } catch (err) {
    return res
    .status(500)
    .json({ statusCode: 500, message:"internal server error", data: null });
  }
};

export const deletewishlist = async (req, res, next) => {
  const userid = req.params.id;
  if (!userid) {
    return res.status(404).json({
      statusCode:404,
      message:"user not found",
      data:null
    })
  }

  try {
    const { packageid } = req.body;
    if (!packageid) {
      return res.status(404).json({
        statusCode:404,
        message:"package not found",
        data:null
      })
    }

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({
        statusCode:404,
        message:"user not found",
        data:null
      })
    }

    await User.updateOne({ _id: userid }, { $pull: { wishlist: packageid } });

    return res.status(200).json({
      statusCode: 200,
      message: "successfully deleted package",
      data:null
    });
  } catch (err) {
    return res
    .status(500)
    .json({ statusCode: 500, message:"internal server error", data: null });
  }
};


