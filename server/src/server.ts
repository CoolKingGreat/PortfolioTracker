import express from "express";
import "dotenv/config";
import marketRouter from "./routes/market.routes"
import authRouter from "./routes/auth.routes"
import assetRouter from "./routes/asset.routes"
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());

app.use("/api/market", marketRouter);
app.use('/api/auth', authRouter);
app.use("/api/assets", assetRouter)

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
})