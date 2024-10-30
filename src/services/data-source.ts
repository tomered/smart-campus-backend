import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

// connect to sensors DB in postgreSQL
export const sensorsDataSource = new DataSource({
  type: "postgres",
  host: process.env.SDB_HOST,
  port: parseInt(process.env.SDB_PORT || "5432", 10),
  username: process.env.SDB_USERNAME,
  password: process.env.SDB_PASSWORD,
  database: process.env.SDB,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
});

// Initialize the sensors data source
sensorsDataSource
  .initialize()
  .then(() => {
    console.log("connected to Sensors DB!");
  })
  .catch((error) => {
    console.error("Error during Sensors Data Source initialization:", error);
  });
