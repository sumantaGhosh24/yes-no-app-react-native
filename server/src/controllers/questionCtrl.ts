import {Request, Response} from "express";

import {APIFeatures} from "../lib";
import Question from "../models/questionModel";
import Entry, {IEntry} from "../models/entryModel";
import {IReqAuth} from "../types";
import Transaction from "../models/transactionModel";
import User from "../models/userModel";

const questionCtrl = {
  getQuestionsAdmin: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(
        Question.find()
          .populate("owner", "_id username email mobileNumber image")
          .populate("category", "name image"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const features2 = new APIFeatures(Question.find(), req.query)
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const questions = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.json({questions, count, success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  getQuestionAdmin: async (req: Request, res: Response) => {
    try {
      const question = await Question.findById(req.params.id)
        .populate("owner", "_id username email mobileNumber image")
        .populate("category", "name image");
      if (!question) {
        res.json({message: "This question does not exists.", success: false});
        return;
      }

      res.json({question, success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  createQuestion: async (req: IReqAuth, res: Response) => {
    try {
      const {category, question, minBet, maxBet, starting, ending} = req.body;
      const owner = req?.user?._id;

      if (
        !category ||
        !question ||
        !minBet ||
        !maxBet ||
        !starting ||
        !ending
      ) {
        res.json({message: "Please fill all fields.", success: false});
        return;
      }

      if (Number(minBet) > Number(maxBet)) {
        res.json({
          message: "Min bet should be less than max bet.",
          success: false,
        });
        return;
      }

      const newQuestion = new Question({
        owner: owner,
        category: category,
        question: question.toLowerCase(),
        minBet: minBet,
        maxBet: maxBet,
        starting: starting,
        ending: ending,
      });
      await newQuestion.save();

      res.json({message: "Question created successfully.", success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  updateQuestion: async (req: Request, res: Response) => {
    try {
      const {category, question, minBet, maxBet, starting, ending} = req.body;
      const questionId = req.params.id;

      const ques = await Question.findById(questionId);
      if (!ques) {
        res.json({message: "This question does not exists.", success: false});
        return;
      }

      if (ques.result === "completed") {
        res.json({
          message: "This question is already completed.",
          success: false,
        });
        return;
      }

      if (category) ques.category = category;
      if (question) ques.question = question.toLowerCase();
      if (minBet) ques.minBet = minBet;
      if (maxBet) ques.maxBet = maxBet;
      if (starting) ques.starting = starting;
      if (ending) ques.ending = ending;

      await ques.save();

      res.json({message: "Question updated successfully.", success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  deleteQuestion: async (req: Request, res: Response) => {
    try {
      const question = await Question.findById(req.params.id);
      if (!question) {
        res.json({message: "This question does not exists.", success: false});
        return;
      }

      if (question.result === "completed") {
        res.json({
          message: "This question is already completed.",
          success: false,
        });
        return;
      }

      if (question.starting < new Date()) {
        res.json({
          message: "This question is already started.",
          success: false,
        });
        return;
      }

      await Question.findByIdAndDelete(req.params.id);

      res.json({message: "Question deleted successfully.", success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  getAllEntrys: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(
        Entry.find()
          .populate("user", "_id username email mobileNumber image")
          .populate("question", "question category"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const features2 = new APIFeatures(Entry.find(), req.query)
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const entries = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.json({entries, count, success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  declareResult: async (req: Request, res: Response) => {
    try {
      const questionId = req.params.id;

      const question = await Question.findByIdAndUpdate(
        questionId,
        {result: "completed", answer: req.body.answer},
        {new: true}
      ).populate("owner");
      if (!question) {
        res.json({message: "This question does not exists.", success: false});
        return;
      }

      const entries = await Entry.find({question: questionId}).populate("user");

      if (!entries || entries.length === 0) {
        res.json({
          message: "No entries found for this question.",
          success: true,
        });
        return;
      }

      const winningEntries: IEntry[] = [];
      const losingEntries: IEntry[] = [];

      entries.forEach((entry) => {
        if (entry.answer === req.body.answer) {
          winningEntries.push(entry);
          entry.result = "success";
        } else {
          losingEntries.push(entry);
          entry.result = "failed";
        }
      });

      await Promise.all(losingEntries.map((entry) => entry.save()));

      if (winningEntries.length === 0) {
        res.json({
          message: "No winning entries. Nothing to distribute.",
          success: false,
        });
        return;
      }

      await Promise.all(
        winningEntries.map(async (winningEntry) => {
          const winningUser = await User.findById(winningEntry.user._id);

          if (winningUser) {
            winningEntry.win = winningEntry.bet * 1.5;
            await winningEntry.save();
            await winningUser.save();

            const newTransaction = new Transaction({
              user: winningUser._id,
              amount: winningEntry.bet * 1.5,
              message: `Win ${
                winningEntry.bet * 1.5
              } on question ${questionId}`,
              status: "win",
              paymentResult: {
                id: "orderId",
                status: "success",
                razorpay_order_id: "razorpayOrderId",
                razorpay_payment_id: "razorpayPaymentId",
                razorpay_signature: "razorpaySignature",
              },
            });
            await newTransaction.save();
          }
          await User.findByIdAndUpdate(winningEntry.user._id, {
            $inc: {amount: winningEntry.bet * 1.5},
          });
        })
      );

      res.json({
        message: "Result declared and funds distributed successfully.",
        success: true,
      });
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  getQuestions: async (req: Request, res: Response) => {
    try {
      const features = new APIFeatures(
        Question.find({result: "pending"})
          .populate("owner", "_id username email mobileNumber image")
          .populate("category", "name image"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const features2 = new APIFeatures(
        Question.find({result: "pending"}),
        req.query
      )
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const questions = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.json({questions, count, success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  getQuestion: async (req: Request, res: Response) => {
    try {
      const question = await Question.findOne({
        _id: req.params.id,
        result: "pending",
      })
        .populate("owner", "_id username email mobileNumber image")
        .populate("category", "name image");
      if (!question) {
        res.json({message: "This question does not exists.", success: false});
        return;
      }

      res.json({question, success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  addEntry: async (req: IReqAuth, res: Response) => {
    try {
      const user = req.user?._id;
      const questionId = req.params.id;
      const {bet, answer} = req.body;

      const question = await Question.findById(questionId);
      if (!question) {
        res.json({message: "This question does not exists.", success: false});
        return;
      }

      if (question.result === "completed") {
        res.json({
          message: "This question is already completed.",
          success: false,
        });
        return;
      }

      if (!bet) {
        res.json({message: "Bet amount is required.", success: false});
        return;
      }

      if (question.minBet > Number(bet) || question.maxBet < Number(bet)) {
        res.json({message: "Invalid bet amount.", success: false});
        return;
      }

      const newEntry = new Entry({
        user: user,
        question: questionId,
        bet,
        answer,
      });
      await newEntry.save();

      const newTransaction = new Transaction({
        user: user,
        amount: bet,
        message: `Bet ${bet} on question ${questionId}`,
        status: "bet",
        paymentResult: {
          id: "orderId",
          status: "success",
          razorpay_order_id: "razorpayOrderId",
          razorpay_payment_id: "razorpayPaymentId",
          razorpay_signature: "razorpaySignature",
        },
      });
      await newTransaction.save();

      await User.findByIdAndUpdate(user, {$inc: {amount: -bet}});

      res.json({message: "Entry added successfully.", success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  getMyEntrys: async (req: IReqAuth, res: Response) => {
    try {
      const features = new APIFeatures(
        Entry.find({user: req.user?._id}).populate(
          "question",
          "question category"
        ),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const features2 = new APIFeatures(
        Entry.find({user: req.user?._id}),
        req.query
      )
        .searching()
        .filtering();

      const result = await Promise.allSettled([
        features.query,
        features2.query,
      ]);

      const entries = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[1].status === "fulfilled" ? result[1].value.length : 0;

      res.json({entries, count, success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
};

export default questionCtrl;
