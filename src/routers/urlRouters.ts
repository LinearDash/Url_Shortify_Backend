import express from "express";
import { createShortUrl, getAllUrls,getMyUrls, getUrlDetails } from "../controllers/urlController";
import { authMiddlewareToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/shorten",authMiddlewareToken, createShortUrl);

router.get('/myUrls',authMiddlewareToken, getMyUrls);

router.get(`/health`, (req, res) => {
    res.status(200).json({ message: "URL Router is healthy" });
});

router.get("/:shortCode", getUrlDetails);

router.get('/',getAllUrls);


export default router;