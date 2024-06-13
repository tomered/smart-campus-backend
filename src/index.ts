import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { pagination } from "typeorm-pagination";
import { Client } from "pg";

import { User } from "./services/entities/User";
import { DataSource } from "typeorm"

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
  entities: [User],
  synchronize: true,
});


const main = async () => {
  try{
  const connection = await dataSource.initialize();
  console.log('Connected to Postgres');
  // const userRepository = connection.getRepository('users');
  // const user = new Users();
  // user.firstName = "gal";
  // user.lastName = "kalev";
  // user.email = "g@g.com";
  // user.id = 1234;
  // user.phone = 1234567890;
  // user.userName = "galkal";

  // await userRepository.save(user);

  // const allUsers = await userRepository.find();

  // console.log(allUsers);
  }catch(err){
    console.log('Unable to connect to Postgres ' + err);
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
