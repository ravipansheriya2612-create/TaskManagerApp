import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.error("Blocked CORS origin:", origin);

            return callback(
                new Error(`CORS blocked origin: ${origin}`)
            );
        },
        credentials: true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Task Manager API is running...");
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Task Manager API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "API route not found",
    });
});

app.use((error, req, res, next) => {
    console.error(error.message);

    res.status(500).json({
        message:
            error.message || "Internal server error",
    });
});

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(
        `Server running on http://${HOST}:${PORT}`
    );
});