import express, { Express, Router, Request, Response } from "express";
import { addProductInDB } from "../../db/products";
import { getPhotoURL, uploadPicture } from "../../db/storage";

export default async function addProduct(req: Request, res: Response) {
  // const url = await getPhotoURL("9/image-1.png");
  addProductInDB(req.body, req.files);
}
