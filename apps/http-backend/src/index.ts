import express from "express"
import mainRouter from "./routes";

const app = express();
app.use(express.json());

app.use("/api/v1", mainRouter)

app.listen(3001, () => {console.log("listening on port", 3001)});