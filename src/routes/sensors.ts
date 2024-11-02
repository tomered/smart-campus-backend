import { Request, Response, Router } from "express";
import { sensorsDataSource } from "../services/data-source";

const router = Router();

/**
 * Fetch sensor records from the database, including their location and associated data
 */

router.get("/all-data", async (req: Request, res: Response) => {
  try {
    const allSensors = await sensorsDataSource
      .createQueryBuilder()
      .select("sensors.*")
      .addSelect("location.*")
      .addSelect("sensors_data.*")
      .from("sensors", "sensors")
      .leftJoin("location", "location", "location.id = sensors.id")
      .leftJoin("sensorsData", "sensors_data", "sensors_data.id = sensors.id")
      .getRawMany();

    res.json(allSensors);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Failed to get sensors data");
  }
});

export default router;
