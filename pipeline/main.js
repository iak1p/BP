import express from "express";
import cors from "cors";
import pipelineRoutes from "./src/routes/pipelineRoutes.routes.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(4001, async () => {
  console.log(`Pipeline server running on port ${4001}`);
});

app.use("/api/pipeline", pipelineRoutes);