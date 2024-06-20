import express, { Express, Response } from "express";
import dotenv from "dotenv";
import { pagination } from "typeorm-pagination";
import { authenticateUser } from "./middleware/authenticateUser";
import loginRouter from "./routes/login";
import { DataSource } from "typeorm";
import { User } from "./entities/user";
import { Role } from "./entities/role";
import { defaultRoles } from "./utils/utilities";

dotenv.config();

const app: Express = express();
app.use(express.json());

app.use("/login", loginRouter);
app.use("/api", authenticateUser);

const port = process.env.PORT || 3000;

// Connect to the database in PostgreSQL
const dataSource = new DataSource({
  type: "postgres",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB,
  schema: process.env.SCHEMA,
  entities: [User, Role],
  synchronize: true,
});

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
    console.error(err);
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
