import type { Request, Response } from "express"
import { prisma } from "../config/db";

export const createClickLog = async (req: Request, res: Response) => {
    try {
        
        const userAgent= req.headers['user-agent'] || '';
        const { urlShortCode, country,ip } = req.body;


        console.log(`urlShortCode: ${urlShortCode}, ip: ${ip}, userAgent: ${userAgent}, country: ${country}`);
        
        const Url = await prisma.url.findUnique({
            where: { shortCode: urlShortCode }
        });

        if (!Url) {
            res.status(404).json({ message: "URL not found" });
            return;
        }

        const duplicateClick = await prisma.click.findFirst({
            where: {
                urlId: Url.id,
                ip: ip,
                userAgent: userAgent
            }

        });

        if (duplicateClick) {
            res.status(200).json(duplicateClick);
            return;
        }
        const clickLog = await prisma.click.create({
            data: {
                urlId: Url.id,
                ip: ip,
                userAgent: userAgent || 'Unknown',
                country,
            },
        });
        res.status(201).json(clickLog);
    } catch (error) {
        console.error("Error creating click log:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getClickStats = async (req: Request, res: Response) => {
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
            shortCode: urlRecord.shortCode,
            originalUrl: urlRecord.originalUrl,
            totalClicks: urlRecord.clickLogs.length,
            clicks: urlRecord.clickLogs,
        });
    } catch (error) {
        console.error("Error fetching click stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}