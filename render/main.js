import express from "express";
import cors from "cors";
import canvasRoutes from "./src/routes/canvas.renderer.routes.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(4004, async () => {
  console.log(`Server running on port ${4004}`);
});

app.use("/api/canvas", canvasRoutes);
