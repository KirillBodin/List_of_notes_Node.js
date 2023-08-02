import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/notes", notesRoutes);

export default app;
