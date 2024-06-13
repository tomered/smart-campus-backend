import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { pagination } from "typeorm-pagination";
import { Client } from "pg";
import { authenticateUser } from "./middleware/authenticateUser";
import loginRouter from './routes/login';
import appRouter from './routes/app';

dotenv.config();

const app: Express = express();
app.use(express.json());

app.use('/login', loginRouter);
app.use('/api', authenticateUser, appRouter);


const port = process.env.PORT || 3000;
const client = new Client({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB,
});

client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

client.query("SELECT * FROM users", (err, result) => {
  if (err) {
    console.error("Error executing query", err);
  } else {
    console.log("Query result:", result.rows);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(pagination);

app.get("/smart", (_, res: Response) => {
  res.status(200).json({
    success: true,
    message: "You are on node-typescript-boilerplate.",
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
