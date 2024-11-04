import { config } from 'dotenv';

config({
  path: path.resolve(process.cwd(), "./.env")
});

import path from 'path';

import { Hono } from 'hono'
import { cors } from 'hono/cors';

import { serve } from '@hono/node-server'

import { router as mainRouter } from './routes/index';

const app = new Hono();

app.use(cors({
  origin: (x) => x,
}));

app.route("/", mainRouter);

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});
