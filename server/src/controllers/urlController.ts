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
                errors: validation.error 
            });
            return;
        }

        const { originalUrl } = validation.data;
        
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