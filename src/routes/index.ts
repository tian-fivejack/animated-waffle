import { Router } from "express";
import { postDataPungutan } from "../controller/dataController";

const rootRouter = Router();
rootRouter.post("/data-pungutan", postDataPungutan);

export default rootRouter;
