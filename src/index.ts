import express, { Request, Response } from "express";
import { env } from "./config/env";
import rootRouter from "./routes";
// import { errorMiddleware } from "./middlewares/error";

const app = express();
const port = env.PORT || 3000;

app.get("/", (_: Request, res: Response) => {
  res.send("Data Test Server");
});

app.use(express.json());

app.use("/v1", rootRouter);
// app.get("/test-error", (req, res, next) => {
//   const error = new Error("This is a test error");
//   next(error);
// });
// app.use(errorMiddleware);

app.listen(port, () => {
  console.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});
