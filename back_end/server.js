import express from "express";
import cors from "cors";
import morgan from "morgan";
import roots from "./root.routes.js";


export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.get("/test", (req, res) => {
  res.json({ ok: true });
});

// routes
app.use("/root",roots);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Not found" });
});

app.listen(5000,()=>{
    console.log('Server started')
})