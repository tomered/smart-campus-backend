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

    // Set token expiration time to 24 hours from now
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create a random sequence of characters for the email verification token

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

    // Send email verification
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
      },
    });

    const verificationUrl = `https://your-domain.com/verify-email?token=${token}&email=${email}`;

    const mailOptions = {
      from: "smartcampushit@gmail.com",
      to: user.email,
      subject: "Email Verification",
      text: `Please verify your email by clicking the following link: ${verificationUrl}. This link will expire in 24 hours.`,
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
