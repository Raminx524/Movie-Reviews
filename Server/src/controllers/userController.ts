import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IRequestWithUserId } from "../interfaces/dataTypes";

const { ACCESS_TOKEN_SECRET } = process.env;
const prismaClient = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password, profile_pic_url } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const response = await prismaClient.user.create({
      data: { username, email, password_hash, profile_pic_url },
    });
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await prismaClient.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    const token = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET!, {
      expiresIn: "2h",
    });
    const userInfo = {
      _id: user.id,
      username: user.username,
      email: user.email,
      profile_pic_url: user.profile_pic_url,
      token,
    };
    res.status(200).send(userInfo);
  } catch (err: any) {
    console.log(err);

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUser = async (req: IRequestWithUserId, res: Response) => {
  if (req.userId !== Number(req.params.id)) {
    res.status(403).json({ error: "Unauthorized access" });
    return;
  }
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: Number(req.params.id) },
    });
    const { password_hash, ...rest } = user!;
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
};

export const updateUser = async (req: IRequestWithUserId, res: Response) => {
  if (req.userId !== Number(req.params.id)) {
    res.status(403).json({ error: "Unauthorized access" });
    return;
  }
  try {
    const user = await prismaClient.user.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
};
