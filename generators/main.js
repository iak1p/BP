import express from "express";
import cors from "cors";
import generatorRoutesAuto from "./src/routes/generatorRoutesAuto.routes.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(4002, async () => {
  console.log(`Generators server running on port ${4002}`);
});

app.use("/api/generator", generatorRoutesAuto);
