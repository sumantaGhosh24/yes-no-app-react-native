import {Request, Response} from "express";
import bcrypt from "bcryptjs";

import User from "../models/userModel";
import {IReqAuth} from "../types";
import {createAccessToken} from "../lib/utils";
import {APIFeatures} from "../lib";

const userCtrl = {
  register: async (req: Request, res: Response) => {
    try {
      const {email, mobileNumber, password, cf_password} = req.body;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) {
        res.json({message: errors, success: false});
        return;
      }

      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        res.json({
          message: "Please enter a valid email address.",
          success: false,
        });
        return;
      }

      if (!mobileNumber.match(/^\d{10}$/)) {
        res.json({
          message: "Please enter a valid mobile number.",
          success: false,
        });
        return;
      }

      const userEmail = await User.findOne({email});
      if (userEmail) {
        res.json({
          message: "This email address already registered.",
          success: false,
        });
        return;
      }

      const userMobileNumber = await User.findOne({mobileNumber});
      if (userMobileNumber) {
        res.json({
          message: "This mobile number already registered.",
          success: false,
        });
        return;
      }

      if (password.length < 6) {
        res.json({
          message: "Password length must be 6 characters long.",
          success: false,
        });
        return;
      }
      if (password !== cf_password) {
        res.json({
          message: "Password and confirm password not match.",
          success: false,
        });
        return;
      }

      const randomNumber = Math.floor(100000 + Math.random() * 999999);

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        mobileNumber,
        password: passwordHash,
        token: {
          auth: "register",
          otp: randomNumber,
        },
      });
      await newUser.save();

      res.json({
        message: "You are registered successfully.",
        success: true,
      });
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const {email, password} = req.body;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) {
        res.json({message: errors, success: false});
        return;
      }

      const user = await User.findOne({email});
      if (!user) {
        res.json({message: "User doest not exists.", success: false});
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.json({message: "Invalid Login Credentials.", success: false});
        return;
      }

      const accesstoken = createAccessToken({
        id: user._id,
      });

      res.json({
        accesstoken,
        success: true,
        message: "User login successful!",
      });
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  userImage: async (req: IReqAuth, res: Response) => {
    try {
      const {image} = req.body;

      if (!image) {
        res.json({message: "Image is required", success: false});
        return;
      }

      const user = await User.findByIdAndUpdate(req?.user?._id, {
        image: image,
      });
      if (!user) {
        res.json({message: "User does not exists.", success: false});
        return;
      }

      res.json({message: "User image updated.", success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  userData: async (req: IReqAuth, res: Response) => {
    try {
      const {firstName, lastName, username, dob, gender} = req.body;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }

      if (errors.length > 0) {
        res.json({message: errors, success: false});
        return;
      }

      const matchUsername = await User.findOne({username});
      if (matchUsername) {
        res.json({
          message: "This username already register, try another one.",
          success: false,
        });
        return;
      }

      const user = await User.findByIdAndUpdate(req?.user?._id, {
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        username: username.toLowerCase(),
        image: req.body.image,
        dob,
        gender: gender.toLowerCase(),
      });
      if (!user) {
        res.json({message: "User does not exists.", success: false});
        return;
      }

      res.json({message: "User data updated.", success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  userAddress: async (req: IReqAuth, res: Response) => {
    try {
      const {city, state, country, zip, addressline} = req.body;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) {
        res.json({message: errors, success: false});
        return;
      }

      const user = await User.findByIdAndUpdate(req?.user?._id, {
        city: city.toLowerCase(),
        state: state.toLowerCase(),
        country: country.toLowerCase(),
        zip,
        addressline: addressline.toLowerCase(),
      });
      if (!user) {
        res.json({message: "User does not exists.", success: false});
        return;
      }

      res.json({message: "User address updated.", success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  resetPassword: async (req: IReqAuth, res: Response) => {
    try {
      const {previousPassword, newPassword, cf_newPassword} = req.body;

      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please fill ${key} field.`);
        }
      }
      if (errors.length > 0) {
        res.json({message: errors, success: false});
        return;
      }

      const user = await User.findById(req?.user?._id);
      const isMatch = await bcrypt.compare(previousPassword, user!.password);
      if (!isMatch) {
        res.json({message: "Invalid login credentials.", success: false});
        return;
      }
      if (newPassword != cf_newPassword) {
        res.json({
          message: "Password and Confirm Password not match.",
          success: false,
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateUser = await User.findByIdAndUpdate(req?.user?._id, {
        password: hashedPassword,
      });
      if (!updateUser) {
        res.json({message: "User does not exists.", success: false});
        return;
      }

      res.json({message: "Password reset successfully!", success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  getUsers: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(User.find(), req.query)
        .paginating()
        .sorting();
      const features2 = new APIFeatures(User.find(), req.query);

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const users = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.json({users, count, success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  getMe: async (req: IReqAuth, res: Response) => {
    try {
      const user = await User.findById(req?.user?._id).select("-password");

      res.json({user, success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
};

export default userCtrl;
