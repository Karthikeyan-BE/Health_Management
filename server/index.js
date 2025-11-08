import cookieParser from "cookie-parser";
import express from "express";
import { PORT as PORT_NUMBER } from "./config/env.js";
import connectDB from "./config/connectDB.js";
import cors from "cors";
// --- Import Routes ---
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import adminRoutes from "./routes/admin.route.js";

// --- Import Error Middleware ---
import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json()); // For parsing application/json
app.use(cookieParser()); // For parsing cookies

// --- API Routes ---
// All your application routes are now connected
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/admin", adminRoutes);

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("API is running successfully.");
});

// --- Error Handling Middleware ---
// (Must be after your routes)
app.use(notFound);
app.use(errorHandler);

// --- Start Server ---
const PORT = PORT_NUMBER || 3000;
app.listen(PORT, () => {
  console.log(
    // (I fixed the URL for you)
    `Server is Running on PORT ${PORT}\nAPI URL: http://localhost:${PORT}`
  );
  connectDB();
});
