import express from "express";
import expressAsyncHandler from "express-async-handler";
import Taboo from "../models/tabooModel.js";
import { isAdmin, isAuth } from "../utils.js";

const tabooRouter = express.Router();

tabooRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const tabooWord = new Taboo({
      word: req.body.word,
    });
    const createdTabooWord = await tabooWord.save();
    res
      .status(201)
      .send({ message: "New Taboo Created", tabooWord: createdTabooWord });
  })
);

tabooRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const tabooWord = await Taboo.findById(req.params.id);
    if (tabooWord) {
      res.send(tabooWord);
    } else {
      res.status(404).send({ message: "Taboo Not Found" });
    }
  })
);

tabooRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const tabooWords = await Taboo.find({});
    res.send(tabooWords);
  })
);

tabooRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const tabooWord = await Taboo.findById(req.params.id);
    if (tabooWord) {
      const deleteUser = await tabooWord.remove();
      res.send({ message: "Taboo Deleted", tabooWord: deleteUser });
    } else {
      res.status(404).send({ message: "Taboo Not Found" });
    }
  })
);

tabooRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const tabooWord = await Taboo.findById(req.params.id);
    if (tabooWord) {
      tabooWord.word = req.body.word || tabooWord.word;
      const updatedUser = await tabooWord.save();
      res.send({ message: "Taboo Updated", tabooWord: updatedUser });
    } else {
      res.status(404).send({ message: "Taboo Not Found" });
    }
  })
);

export default tabooRouter;
