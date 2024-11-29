import Visa from "../model/VisaSchema.js";
import { visaValidationSchema } from "../model/ValidationSchema.js";
import dotenv from "dotenv";
import Inquiry from "../model/inquirySchema.js"
import transporter from "../utility/Nodemailer.js"; 
dotenv.config();


// Create a new Visa
export const createVisa = async (req, res) => {
  const { value, error } = visaValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "Validation error",
      details: error.details,
      data: null,
    });
  }

  try {
    const newVisa = await Visa.create(value);

    res.status(201).json({
      statusCode: 201,
      message: "Visa created successfully",
      data: newVisa,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};

// Get all Visas
export const getAllVisas = async (req, res) => {
  try {
    const visas = await Visa.find();
    const visaCount = await Visa.countDocuments();

    res.status(200).json({
      statusCode: 200,
      message: "Successfully fetched visas",
      data: visas,
      dataCount: visaCount,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};

// Get Visa by ID
export const getVisaById = async (req, res) => {
  try {
    const { id } = req.params;

    const visa = await Visa.findById(id);

    if (!visa) {
      return res.status(404).json({
        statusCode: 404,
        message: "Visa not found",
        data: null,
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Successfully fetched visa",
      data: visa,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};

// Update Visa
export const updateVisa = async (req, res) => {
  const { value, error } = visaValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "Validation error",
      data: null,
    });
  }

  try {
    const { id } = req.params;

    const updatedVisa = await Visa.findByIdAndUpdate(
      id,
      { $set: value },
      { new: true, runValidators: true }
    );

    if (!updatedVisa) {
      return res.status(404).json({
        statusCode: 404,
        message: "Visa not found",
        data: null,
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Visa updated successfully",
      data: updatedVisa,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};

// Delete Visa
export const deleteVisa = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVisa = await Visa.findByIdAndDelete(id);

    if (!deletedVisa) {
      return res.status(404).json({
        statusCode: 404,
        message: "Visa not found",
        data: null,
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Visa deleted successfully",
      data: deletedVisa,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: null });
  }
};

// Search Visas
export const searchVisas = async (req, res) => {
    try {
      const { visaType, country, nationality, travelerNumber, minFee, maxFee } = req.query;
  
      const query = {};
  
      
      if (country) {
        query.country = { $regex: country, $options: "i" }; 
      }
  
      
      if (visaType) {
        query.visaType = { $regex: visaType, $options: "i" }; 
      }
  
    
      if (nationality) {
        query.nationality = { $regex: nationality, $options: "i" };
      }
  
      
      if (travelerNumber) {
        query.travelerNumber = { $gte: Number(travelerNumber) }; 
      }
  
      
      if (minFee || maxFee) {
        query.pricePerPerson = {};
        if (minFee) query.pricePerPerson.$gte = Number(minFee);
        if (maxFee) query.pricePerPerson.$lte = Number(maxFee);
      }
  
      const visas = await Visa.find(query);
  
      if (visas.length === 0) {
        return res.status(404).json({
          statusCode: 404,
          message: "No visas found matching your criteria",
          data: null,
        });
      }
  
      res.status(200).json({
        statusCode: 200,
        message: "Successfully fetched visas",
        data: visas,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ statusCode: 500, message: "Internal server error", data: null });
    }
  };
  export const submitInquiry = async (req, res) => {
    try {
      const { name, email, phoneNumber, visaType, country, message } = req.body;
  
    
      const inquiry = new Inquiry({
        name,
        email,
        phoneNumber,
        visaType,
        country,
        message,
      });
      await inquiry.save();
  
      
      const mailOptions = {
        from: email, 
        to: process.env.App_Email,
        subject: "New Inquiry Submission",
        html: `
          <h2>New Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone Number:</strong> ${phoneNumber}</p>
          <p><strong>Visa Type:</strong> ${visaType}</p>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      };
  
      
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: "Inquiry submitted successfully and email sent!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
   



  