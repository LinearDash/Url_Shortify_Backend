import type { Request, Response } from "express"
import { createShortUrlSchema } from "../schemas/url.schema";
import { generateShortCode } from "../utilts/shortCodeGen";
import { prisma } from "../config/db";

export const createShortUrl = async (req: Request, res: Response) => {
    try {
        const validation = createShortUrlSchema.safeParse(req.body);
        
        if (!validation.success) {
            res.status(400).json({ 
                message: "Validation error", 
                errors: validation.error.issues 
            });
            return;
        }

        const { originalUrl } = validation.data;
        const ownerId = req.user!.id;

        const user = await prisma.user.findUnique({
            where: { id: ownerId }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        
        let shortCode = generateShortCode();
        let findUrl = await prisma.url.findUnique({
            where: { shortCode }
        });

        while (findUrl) {
            shortCode = generateShortCode();
            findUrl = await prisma.url.findUnique({
            where: { shortCode }
            });
        }
        
        const newUrl = await prisma.url.create({
            data: {
                originalUrl,
                shortCode,
                ownerId,
            },
        });

        res.status(201).json({
            message: "Short URL created successfully",
            data: newUrl,
        });

    } catch (error) {
        console.error("Error creating short URL:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getUrlDetails = async (req: Request, res: Response) => {
    try {
        const { shortCode } = req.params;

        const urlRecord = await prisma.url.findUnique({
            where: { shortCode },
            include: {
                clickLogs: true,
            },
        });

        if (!urlRecord) {
            res.status(404).json({ message: "Short URL not found" });
            return;
        }

        res.status(200).json({
            message: "URL Detail retrieved successfully",
            data: urlRecord,
        });

    } catch (error) {
        console.error("Error retrieving URL Detail:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllUrls = async (req: Request, res: Response) => {
    try {
        const urls = await prisma.url.findMany({
            include: {
                clickLogs: true,
            },
        });

        if (urls.length === 0) {
            res.status(404).json({ message: "No URLs found" });
            return;
        }

        res.status(200).json({
            message: "URLs retrieved successfully",
            data: urls,
        });
    } catch (error) {
        console.error("Error retrieving URLs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMyUrls = async (req: Request, res: Response) => {
    try {
        const ownerId = req.user!.id;    
               
        const urls = await prisma.url.findMany({
            where: {
                ownerId,
            },
            include: {
                clickLogs: true,
            },
        });

        // console.log(urls);
        

        if (urls.length === 0) {
            res.status(404).json({ message: "No URLs found for this user" });
            return;
        }

        res.status(200).json({
            message: "User's URLs retrieved successfully",
            data: urls,
        });
    } catch (error) {
        console.error("Error retrieving user's URLs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}