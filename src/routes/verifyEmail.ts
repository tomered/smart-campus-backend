import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../entities/user";
import { dataSource } from "../services/db";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { token, email } = req.body;

  try {
    const user = await dataSource
      .getRepository(User)
      .findOne({ where: { email: email as string } });

    if (!user) {
      return res.status(400).send("Invalid email or token.");
    }

    const isValidToken = await bcrypt.compare(
      token as string,
      user.emailVerificationToken!
    );

    if (!isValidToken) {
      return res.status(400).send("Invalid or expired token.");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;

    await dataSource.getRepository(User).save(user);

    return res.status(200).send("Email successfully verified!");
  } catch (err) {
    return res.status(500).send((err as Error).message);
  }
});

export default router;
