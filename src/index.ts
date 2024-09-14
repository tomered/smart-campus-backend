import express, { Express, Response } from "express";
import dotenv from "dotenv";
import { pagination } from "typeorm-pagination";
import { authenticateUser } from "./middleware/authenticateUser";
import { validateAdmin } from "./middleware/validateAdmin";
import loginRouter from "./routes/login";
import registerRouter from "./routes/register";
import adminEndpoint from "./routes/adminEndpoint";
import { Role } from "./entities/role";
import { dataSource } from "./services/db";
import { defaultRoles } from "./constants";

dotenv.config();

const app: Express = express();
app.use(express.json());

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/api", authenticateUser, validateAdmin, adminEndpoint);

const port = process.env.PORT || 10000;

// Function to initialize connection to DB and checks Role table
const main = async () => {
  try {
    await dataSource.initialize();
    const roleRepository = dataSource.getRepository(Role);

    // Checking if the default roles exist in the Role table
    for (const role of defaultRoles) {
      const existingRole = await roleRepository.findOneBy({
        roleId: role.roleId,
      });
      if (!existingRole) {
        await roleRepository.save(role);
      }
    }

    console.log("Connected to Postgres");
  } catch (err) {
    if (err instanceof Error) {
      if ((err as any).code === "ECONNRESET") {
        console.error("Connection reset by peer. Retrying...");
        // You might want to implement retry logic here
      } else {
        console.error("Database connection error:", err.message);
      }
    } else {
      console.error("An unexpected error occurred:", err);
    }
  }
};

main();

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
