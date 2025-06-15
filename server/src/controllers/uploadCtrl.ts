import {Request, Response} from "express";
import cloudinary from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import {UploadedFile} from "express-fileupload";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

interface CloudinaryFile extends UploadedFile {}

const uploadCtrl = {
  uploadImage: async (req: Request, res: Response) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        res
          .json({message: "No image was selected, please select a image.", success: false});
        return;
      }

      const file = req.files.file as CloudinaryFile;
      if ((file.size as any) > 2 * 1024 * 1024) {
        removeTmp(file.tempFilePath);
        res
          .json({message: "Image size is too large. (required within 2mb)", success: false});
        return;
      }

      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
        removeTmp(file.tempFilePath);
        res
          .json({message: "Image format is incorrect. (required jpeg or png)", success: false});
        return;
      }

      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        {folder: "yesno"},
        async (error, result) => {
          if (error) {
            res.json({message: error.message, success: false});
            return;
          }
          if (!result) {
            res.json({message: "Something went wrong!", success: false});
            return;
          }
          removeTmp(file.tempFilePath);
          res.json({
            public_id: result.public_id,
            url: result.secure_url,
            success: true,
          });
          return;
        }
      );
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  deleteImage: async (req: Request, res: Response) => {
    try {
      const {public_id} = req.body;
      if (!public_id) {
        res.json({
          message: "No image was selected, please select a image first.", success: false
        });
        return;
      }

      cloudinary.v2.uploader.destroy(public_id, async (error: any) => {
        if (error) throw error;
        res.json({message: "Image Deleted Successfully.", success: true});
        return;
      });
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
};

const removeTmp = (path: any) => {
  fs.unlink(path, (error: any) => {
    if (error) throw error;
  });
};

export default uploadCtrl;
