import express, { Request, Response } from "express";

const router = express.Router();

//endpoint functions, etc..

router.get("/", async (req: Request, res: Response) => {

  return res.status(200).json({
    status: "The user's role is admin (0), success",
  });
});

export default router;
