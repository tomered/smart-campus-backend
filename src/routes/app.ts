import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { findUserByUsername } from "../models/user";
import { signJwt } from "../utils/jwt";

const router = express.Router();

router.post("/smth", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await findUserByUsername(username);
  if (!user) {
    return res.status(404).send("User not found.");
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).send("Invalid password.");
  }

  const token = signJwt({ username: user.username }, "1h");
  res.send({ token });
});



export default router;
