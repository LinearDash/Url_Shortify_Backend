import express from "express";
import { createClickLog, getClickStats } from "../controllers/clickController";

const router = express.Router();

router.post("/", createClickLog);
router.get("/:shortCode", getClickStats);

export default router;