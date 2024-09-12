import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../entities/user";

export const validateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    const decoded = verifyJwt(token);
    if (!(decoded as JwtPayload)?.username) {
      return res.status(401).send("Invalid token.");
    }

    const username = (decoded as JwtPayload)?.username;

    const user = await User.findOne({
      where: { userName: username },
      relations: ["role"],
    });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (user.role.roleId !== 0) {
      return res.status(403).send("Access denied. Not an admin.");
    }

    return res.status(200).json({
      status: "success",
      data: {
        userName: user.userName,
        role: user.role.roleId,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error.");
  }
};
