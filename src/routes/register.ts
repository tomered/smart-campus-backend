import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../entities/user";
import { dataSource } from "../services/db";
import { IUser } from "../types";
import { validate } from "../services/validation";
import { Role } from "../entities/role";

const router = express.Router();

// User registration
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userName, password, firstName, lastName, phone, userId, email } =
      req.body;

    // Check if the content is valid
    const validationResult = await validate({
      userName,
      firstName,
      lastName,
      phone,
      userId,
      email,
      password,
    });

    if (!validationResult.valid) {
      return res.status(400).json({ errors: validationResult.errors });
    }

    // Bcrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const studentRole = await dataSource
      .getRepository(Role)
      .findOne({ where: { roleId: 1 } });

    if (!studentRole) {
      return res.status(404).json({ message: "Student role not found" });
    }

    const user: IUser = {
      userName,
      firstName,
      lastName,
      phone,
      userId,
      email,
      password: hashedPassword,
      role: studentRole,
    };

    // Add user to DB
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();

    return res.status(200).send("user added to db");
  } catch (err) {
    return res.status(401).send(err);
  }
});

export default router;
