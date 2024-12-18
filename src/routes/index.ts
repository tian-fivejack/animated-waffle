import { Router } from "express";
import { postDataPungutan } from "../controller/dataController";
// import authRoutes from "./auth";

const rootRouter = Router();
// rootRouter.use("/auth", authRoutes);
rootRouter.post("/data-pungutan", postDataPungutan);

export default rootRouter;
