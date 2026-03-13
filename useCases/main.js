import express from "express";
import cors from "cors";
import useCasesRoutes from "./src/routes/useCasesRoutes.route.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(4003, async () => {
  console.log(`Generators server running on port ${4003}`);
});

app.use("/api/usecases", useCasesRoutes);