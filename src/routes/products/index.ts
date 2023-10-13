import { Router, Request, Response } from "express";
import addProduct from "./addProduct";
import upload from "../../configs/multer";
const productsRouter = Router();

productsRouter.post("/add-product", upload.any(), addProduct);
productsRouter.post("/create-account");

export default productsRouter;
