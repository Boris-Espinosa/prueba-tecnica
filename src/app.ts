import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import notesRoutes from "./modules/notes/notes.routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Notes - TypeORM", status: "running" });
});

export default app;
