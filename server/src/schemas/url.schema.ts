import z from "zod";

export const createShortUrlSchema = z.object(
    {
        originalUrl: z.string()
        .url("Invalid URL format")
        .min(1, "URL is required"),
    }
)

export type CreateShortUrlInput = z.infer<typeof createShortUrlSchema>;