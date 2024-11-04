import { router as authRouter } from "./auth";
import { Hono } from "hono";

export const router = new Hono()
    .route("/auth", authRouter);