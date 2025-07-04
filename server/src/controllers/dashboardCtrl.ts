import {Request, Response} from "express";

import Category from "../models/categoryModel";
import Entry from "../models/entryModel";
import Question from "../models/questionModel";
import Transaction from "../models/transactionModel";
import User from "../models/userModel";
import {IReqAuth} from "../types";

const dashboardCtrl = {
  getAdminDashboard: async (req: Request, res: Response) => {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({status: "active"});
      const totalTransactions = await Transaction.countDocuments();
      const totalQuestions = await Question.countDocuments();
      const pendingQuestions = await Question.countDocuments({
        result: "pending",
      });
      const totalCategories = await Category.countDocuments();
      const totalEntries = await Entry.countDocuments();

      const recentUsers = await User.find().sort({createdAt: -1}).limit(5);
      const recentTransactions = await Transaction.find()
        .sort({createdAt: -1})
        .limit(5)
        .populate("user");
      const recentQuestions = await Question.find()
        .sort({createdAt: -1})
        .limit(5)
        .populate("owner")
        .populate("category");
      const recentEntries = await Entry.find()
        .sort({createdAt: -1})
        .limit(5)
        .populate("user")
        .populate("question");
      const recentCategories = await Category.find()
        .sort({createdAt: -1})
        .limit(5);

      const totalDepositAmount = await Transaction.aggregate([
        {$match: {status: "deposit"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);
      const totalWithdrawalAmount = await Transaction.aggregate([
        {$match: {status: "withdraw"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);
      const totalBetAmount = await Transaction.aggregate([
        {$match: {status: "bet"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);
      const totalWinAmount = await Transaction.aggregate([
        {$match: {status: "win"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);
      const totalPenaltyAmount = await Transaction.aggregate([
        {$match: {status: "penalty"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);
      const totalRefundAmount = await Transaction.aggregate([
        {$match: {status: "refund"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);

      res.json({
        totalUsers,
        activeUsers,
        totalTransactions,
        totalQuestions,
        pendingQuestions,
        totalCategories,
        totalEntries,
        recentUsers,
        recentTransactions,
        recentQuestions,
        recentEntries,
        recentCategories,
        totalDepositAmount: totalDepositAmount[0]?.total || 0,
        totalWithdrawalAmount: totalWithdrawalAmount[0]?.total || 0,
        totalBetAmount: totalBetAmount[0]?.total || 0,
        totalWinAmount: totalWinAmount[0]?.total || 0,
        totalPenaltyAmount: totalPenaltyAmount[0]?.total || 0,
        totalRefundAmount: totalRefundAmount[0]?.total || 0,
        success: true,
      });
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  getDashboard: async (req: IReqAuth, res: Response) => {
    try {
      const userId = req.user?._id;

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const userTransactions = await Transaction.find({user: userId})
        .limit(5)
        .sort({createdAt: -1})
        .populate("user");
      const userEntries = await Entry.find({user: userId})
        .limit(5)
        .sort({createdAt: -1})
        .populate("question");

      const totalBets = await Entry.aggregate([
        {$match: {user: userId}},
        {$group: {_id: null, total: {$sum: "$bet"}}},
      ]);
      const totalWins = await Entry.aggregate([
        {$match: {user: userId, result: "success"}},
        {$group: {_id: null, total: {$sum: "$win"}}},
      ]);
      const totalDeposits = await Transaction.aggregate([
        {$match: {user: userId, status: "deposit"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);
      const totalWithdrawals = await Transaction.aggregate([
        {$match: {user: userId, status: "withdraw"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);
      const totalBet = await Transaction.aggregate([
        {$match: {user: userId, status: "bet"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);
      const totalWin = await Transaction.aggregate([
        {$match: {user: userId, status: "win"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);
      const totalPenalty = await Transaction.aggregate([
        {$match: {user: userId, status: "penalty"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);
      const totalRefund = await Transaction.aggregate([
        {$match: {user: userId, status: "refund"}},
        {$group: {_id: null, total: {$sum: "$amount"}}},
      ]);

      res.json({
        userTransactions,
        userEntries,
        totalBets: totalBets[0]?.total || 0,
        totalWins: totalWins[0]?.total || 0,
        totalDeposits: totalDeposits[0]?.total || 0,
        totalWithdrawals: totalWithdrawals[0]?.total || 0,
        totalBet: totalBet[0]?.total || 0,
        totalWin: totalWin[0]?.total || 0,
        totalPenalty: totalPenalty[0]?.total || 0,
        totalRefund: totalRefund[0]?.total || 0,
        success: true,
      });
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
};

export default dashboardCtrl;
