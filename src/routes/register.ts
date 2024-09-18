import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../entities/user";
import { dataSource } from "../services/db";
import { IUser } from "../types";
import { validate } from "../services/validation";
import { Role } from "../entities/role";
import nodemailer from "nodemailer";
import crypto from "crypto";

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
      isEmailVerified: false,
      emailVerificationToken: "",
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

    // Generate a random token and hash it with bcrypt
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(token, salt);

    const user: IUser = {
      userName,
      firstName,
      lastName,
      phone,
      userId,
      email,
      password: hashedPassword,
      role: studentRole,
      isEmailVerified: false, // Set to false initially
      emailVerificationToken: hashedToken, // Store the hashed token
    };

    // Add user to DB
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();

    // Send email verification
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: "smartcampushit@gmail.com",
        pass: "lrbf rnso bxzk vnff",
      },
    });

    const verificationUrl = `https://your-domain.com/verify-email?token=${hashedToken}&email=${email}`;

    const mailOptions = {
      from: "smartcampushit@gmail.com",
      to: user.email,
      subject: "Smart Campus Email Verification",
      text: `Please verify your email by clicking the following link: ${verificationUrl}.\n This link will expire in 24 hours.`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .send(
        "User registered successfully. Please check your email for verification."
      );
  } catch (err) {
    return res.status(401).send(err);
  }
});

export default router;
