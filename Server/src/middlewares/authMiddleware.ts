import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IRequestWithUserId } from "../interfaces/dataTypes";

const { ACCESS_TOKEN_SECRET, ADMIN_TOKEN } = process.env;

export function verifyToken(
  req: IRequestWithUserId,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.get("Authorization");
  if (!authorizationHeader) {
    res
      .status(401)
      .json({ error: "Bad request, missing authorization header" });
    return;
  }

  try {
    const token = authorizationHeader.split(" ")[1];

    // Explicitly define the payload structure for your token
    const decoded = jwt.verify(
      token,
      ACCESS_TOKEN_SECRET as string
    ) as JwtPayload & { userId: number };

    if (!decoded.userId) {
      res.status(401).json({ error: "Invalid token payload" });
      return;
    }

    req.userId = decoded.userId; // Assign the userId to the request object
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
}

export const verifyAdmin = (
  req: IRequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.get("Authorization");
  if (!authorizationHeader) {
    res
      .status(401)
      .json({ error: "Bad request, missing authorization header" });
    return;
  }
  if (authorizationHeader !== ADMIN_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};
