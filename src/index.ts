import express from "express";
import cors from "cors";
import dotenv from "dotenv";

//App initialization
const app = express();
dotenv.config();

//Import routes
import { postRoutes } from "./routes/postRoutes";
import { commentRoutes } from "./routes/commentRoutes";

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

//ROUTES
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
