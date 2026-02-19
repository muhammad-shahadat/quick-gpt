import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import createHttpError from "http-errors";

import passport from "./passport.js";
import { errorResponse } from "./controllers/responseController.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import chatRouter from "./routes/chatRoute.js";
import messageRouter from "./routes/messageRoute.js";



const app = express();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());

//home route
app.get("/", (req, res) => {
  res.status(200).send("<h2>Ai Gpt Project</h2>");
});


//users authentication route
app.use("/api/auth/users", authRouter);

//users route
app.use("/api/users", userRouter);

//chat route
app.use("/api/chats", chatRouter);

//message route
app.use("/api/messages", messageRouter);










/** ============Error Handling============ **/

//bad request
app.use((req, res, next) => {
  next(createHttpError(404, "bad request! path not found"));
});

//internal server error and all global errors
app.use((error, req, res, next) => {
  errorResponse(res, {
    statusCode: error.status,
    message: error.message,
  });
});

export default app;
