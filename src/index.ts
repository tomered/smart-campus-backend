import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { pagination } from "typeorm-pagination";
import { Client } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const client = new Client({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB,
});

client.connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
    client.query("SELECT * FROM users", (err, result) => {
      if (err) {
        console.error("Error executing query", err.stack);
      } else {
        console.log("Query result:", result.rows);
      }
    });
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err.stack);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(pagination);

// Endpoint לבדיקה כללית
app.get("/smart", (_, res: Response) => {
  res.status(200).json({
    success: true,
    message: "You are on node-typescript-boilerplate.",
  });
});


// Endpoint לכניסה למערכת
app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }

  const query = `SELECT id, username, password, role FROM public.users WHERE username = $1`;
  
  client.query(query, [username], (err, result) => {
    if (err) {
      console.error("Error executing query:", err.stack);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match) {
        return res.status(401).json({ success: false, message: "Invalid username or password" });
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      res.status(200).json({ success: true, message: "Login successful", token });
    });
  });
});


app.post("/register", async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: "Username, password, and role are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO public.users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role`;
  
  client.query(query, [username, hashedPassword, role], (err, result) => {
    if (err) {
      console.error("Error executing query:", err.stack);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    
    res.status(201).json({ success: true, message: "User registered successfully", user: result.rows[0] });
  });
});

// Middleware לאימות JWT
const authenticateToken = (req: Request, res: Response, next: Function) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Invalid token" });
    req.body.user = user;
    next();
  });
};

// Endpoint שמצריך אימות
app.get("/protected", authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "You have access to this protected route", user: req.body.user });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});


