import { type Handler, Env } from "hono";

export type THandler<P extends string = "/", E extends Env = {}> = Handler<E, P>;