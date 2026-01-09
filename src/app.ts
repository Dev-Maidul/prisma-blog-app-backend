import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';
import { commentRouter } from "./modules/comment/comment.router";
import { errorHandler } from "./middlewares/globarErrorHandler";
import { notFound } from "./middlewares/notFound";


const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000", // client side url
    credentials: true
}))

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

//! Not found middleware
app.use(notFound);
//! Error handler middleware
app.use(errorHandler)

export default app;