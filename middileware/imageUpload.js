import fs from "fs";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // Use current timestamp to avoid filename conflicts
  },
});

// Multer upload middleware for multiple images
const upload = multer({ storage });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload to Cloudinary with retry logic
const uploadToCloudinary = async (filePath, retries = 3) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "touriest-imgs",
    });
    return result;
  } catch (error) {
    if (retries === 0) throw error;
    console.log(`Retrying upload... Attempts left: ${retries}`);
    return uploadToCloudinary(filePath, retries - 1);
  }
};

// Middleware to handle multiple image upload
const multipleImageUpload = (req, res, next) => {
  console.log("Headers:", req.headers); // Log headers to check for Content-Type issues
  upload.array("images", 10)(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({
        error: err.message,
      });
    }

    try {
      const promises = req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.path);

        if (!result || !result.secure_url) {
          throw new Error("Upload to Cloudinary failed");
        }

        // Remove the local file after uploading to Cloudinary
        fs.unlink(file.path, (unlinkerError) => {
          if (unlinkerError) {
            console.log("Error deleting local files", unlinkerError);
          }
        });

        return result.secure_url;
      });

      const uploadedImages = await Promise.all(promises);
      req.body.images = uploadedImages;

      next();
    } catch (error) {
      console.error("Error uploading files to Cloudinary:", error);
      return res.status(500).json({
        message: "Error uploading files to Cloudinary",
      });
    }
  });
};

// Middleware to handle single image upload
const singleImageUpload = (req, res, next) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({
        error: err.message,
      });
    }

    try {
      const file = req.file;

      const result = await uploadToCloudinary(file.path);

      if (!result || !result.secure_url) {
        throw new Error("Upload to Cloudinary failed");
      }

      // Remove the local file after uploading to Cloudinary
      fs.unlink(file.path, (unlinkerError) => {
        if (unlinkerError) {
          console.log("Error deleting local file", unlinkerError);
        }
      });

      req.body.image = result.secure_url;

      next();
    } catch (error) {
      console.error("Error uploading single file to Cloudinary:", error);
      return res.status(500).json({
        message: "Error uploading file to Cloudinary",
      });
    }
  });
};

export { multipleImageUpload, singleImageUpload };
