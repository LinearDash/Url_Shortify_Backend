import express from "express";
import{ prisma } from "./config/db";
import cors from "cors";
import urlRouter from "./routers/urlRouters";
import clickRouter from "./routers/clickRouters";
import dotenv from "dotenv";
import authRouter from "./routers/authRouters";
import passport from "./config/passport";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(passport.initialize());


app.use("/api/auth", authRouter);
app.use("/api/url", urlRouter);
app.use("/api/click", clickRouter);

async function main() {
    try {
        await prisma.$connect();
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(`Fail to start the server`,error);
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});