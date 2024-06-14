import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { pagination } from "typeorm-pagination";
import { Client } from "pg";


import { DataSource } from "typeorm"
import { User } from "./services/entities/user";
import { Role } from "./services/entities/role";
import { defaultRoles } from "./utils/utilities";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const dataSource = new DataSource({
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: 'SmartApp',
  schema: 'local',
  entities: [User, Role],
  synchronize: true,
});




const main = async () => {
  try {
    await dataSource.initialize();
    const roleRepository = dataSource.getRepository(Role);


    // Checking if the default roles exist in the Role table
    for (const role of defaultRoles) {
      const existingRole = await roleRepository.findOneBy({ roleId: role.roleId });
      if (!existingRole) {
        await roleRepository.save(role);
      }
    }
  

    console.log('Connected to Postgres');
    
  } catch (err) {
    console.error(err);
  }

}


main()


// const client = new Client({
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   database: process.env.DB,
// });



// client
//   .connect()
//   .then(() => {
//     console.log("Connected to PostgreSQL database");
//   })
//   .catch((err) => {
//     console.error("Error connecting to PostgreSQL database", err);
//   });

// client.query("SELECT * FROM users", (err, result) => {
//   if (err) {
//     console.error("Error executing query", err);
//   } else {
//     console.log("Query result:", result.rows);
//   }
// });

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
