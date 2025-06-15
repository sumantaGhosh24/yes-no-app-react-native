import {Request, Response} from "express";

import Category from "../models/categoryModel";
import Question from "../models/questionModel";

const categoryCtrl = {
  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await Category.find();

      res.json({categories, success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  createCategory: async (req: Request, res: Response) => {
    try {
      const {name, image} = req.body;

      if (!name || !image) {
        res.json({message: "Please fill all fields.", success: false});
        return;
      }

      const category = await Category.findOne({name});
      if (category) {
        res.json({message: "This category already exists.", success: false});
        return;
      }

      const newCategory = new Category({
        name: name.toLowerCase(),
        image,
      });
      await newCategory.save();

      res.json({message: "Category created successfully.", success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  getCategory: async (req: Request, res: Response) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        res.json({message: "Category not found.", success: false});
        return;
      }

      res.json({category, success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  updateCategory: async (req: Request, res: Response) => {
    try {
      const {name, image} = req.body;

      const category = await Category.findById(req.params.id);
      if (!category) {
        res.json({message: "Category does not exists.", success: false});
        return;
      }

      if (name) category.name = name.toLowerCase();
      if (image) category.image = image;
      await category.save();

      res.json({message: "Category updated successfully.", success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
  deleteCategory: async (req: Request, res: Response) => {
    try {
      const question = await Question.findOne({category: req.params.id});
      if (question) {
        res.json({
          message: "Please delete all question of this category first.",
          success: false,
        });
        return;
      }

      await Category.findByIdAndDelete(req.params.id);

      res.json({message: "Category deleted successfully.", success: true});
      return;
    } catch (error: any) {
      res.json({message: error.message, success: false});
      return;
    }
  },
};

export default categoryCtrl;
