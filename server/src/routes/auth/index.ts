import { Hono } from "hono";
import { router as signUpRouter } from "./sign-up";

export const router = new Hono()
    .route("/sign-up", signUpRouter);