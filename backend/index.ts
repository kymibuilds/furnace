import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.ts";
import authRoutes from "./routes/auth.routes.ts"
import { initializeSocket } from "./socket/socket.ts";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("server is running, test");
});

const server = http.createServer(app);

//listen to socket events
initializeSocket(server);

connectDB()
  .then(() => {
    server.listen(PORT, () => console.log(`server running on port:${PORT}`));
  })
  .catch((error: unknown) => {
    console.log("failed to start server due to database error", error);
  });
