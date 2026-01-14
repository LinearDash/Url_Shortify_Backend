import type { Request, Response } from "express"
import { prisma } from "../config/db";

export const createClickLog = async (req: Request, res: Response) => {
    try {
        const { urlId, ip, userAgent, conuntry } = req.body;

        const clickLog = await prisma.click.create({
            data: {
                urlId,
                ip,
                userAgent,
                conuntry,
            },
        });
        res.status(201).json(clickLog);
    } catch (error) {
        console.error("Error creating click log:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}