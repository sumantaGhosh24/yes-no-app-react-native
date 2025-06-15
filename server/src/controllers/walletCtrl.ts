import {Request, Response} from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

import {IReqAuth} from "../types";
import Transaction from "../models/transactionModel";
import User from "../models/userModel";
import {APIFeatures} from "../lib";

dotenv.config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const walletCtrl = {
  deposit: async (req: Request, res: Response) => {
    try {
      const {amount} = req.body;
      const options = {
        amount: Number(amount * 100),
        currency: "INR",
      };

      const order = await instance.orders.create(options);
      if (!order) {
        res.json({message: "server error", success: false});
        return;
      }

      res.json({order, success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  verification: async (req: IReqAuth, res: Response) => {
    try {
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        amount,
      } = req.body;
      const user = req?.user?._id;

      const shasum = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      );
      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
      const digest = shasum.digest("hex");
      if (digest !== razorpaySignature) {
        res.json({message: "Transaction not legit!", success: false});
        return;
      }

      const newTransaction = new Transaction({
        user: user,
        amount: amount,
        message: `${amount} INR deposited`,
        status: "deposit",
        paymentResult: {
          id: orderCreationId,
          status: "success",
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        },
      });
      await newTransaction.save();

      await User.findByIdAndUpdate(user, {$inc: {amount: amount}});

      res.json({
        message: "success",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        success: true,
      });
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  withdraw: async (req: IReqAuth, res: Response) => {
    try {
      const {amount} = req.body;

      if (req!.user!.amount < amount) {
        res.json({message: "Insufficient balance.", success: false});
        return;
      }

      const newTransaction = new Transaction({
        user: req?.user?._id,
        amount: amount,
        message: `${amount} INR withdrawn`,
        status: "withdraw",
        paymentResult: {
          id: "orderId",
          status: "success",
          razorpay_order_id: "razorpayOrderId",
          razorpay_payment_id: "razorpayPaymentId",
          razorpay_signature: "razorpaySignature",
        },
      });
      await newTransaction.save();

      await User.findByIdAndUpdate(req?.user?._id, {$inc: {amount: -amount}});

      res.json({message: "Withdrawal successful.", success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  getWallet: async (req: IReqAuth, res: Response) => {
    try {
      const user = req?.user?._id;
      const amount = req?.user?.amount;

      const features = new APIFeatures(
        Transaction.find({user: user}),
        req.query
      )
        .paginating()
        .sorting();
      const features2 = new APIFeatures(
        Transaction.find({user: user}),
        req.query
      );

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const transactions =
        result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.json({amount, transactions, count, success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  getAllTransactions: async (req: IReqAuth, res: Response) => {
    try {
      const features = new APIFeatures(Transaction.find(), req.query)
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const features2 = new APIFeatures(Transaction.find(), req.query)
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const transactions =
        result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.json({transactions, count, success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  penalty: async (req: IReqAuth, res: Response) => {
    try {
      const user = req.params.user;
      const amount = req.body.amount;

      if (!amount) {
        res.json({message: "Penalty amount is required.", success: false});
        return;
      }

      await User.findByIdAndUpdate(user, {$inc: {amount: -amount}});

      const newTransaction = new Transaction({
        user: user,
        amount: amount,
        message: `${amount} INR penalty deducted`,
        status: "penalty",
        paymentResult: {
          id: "orderId",
          status: "success",
          razorpay_order_id: "razorpayOrderId",
          razorpay_payment_id: "razorpayPaymentId",
          razorpay_signature: "razorpaySignature",
        },
      });
      await newTransaction.save();

      res.json({message: "Penalty amount deducted.", success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
};

export default walletCtrl;
