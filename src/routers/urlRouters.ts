import express from "express";
import { createShortUrl } from "../controllers/urlController";

const router = express.Router();

router.post("/shorten", createShortUrl);

export default router;