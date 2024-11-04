import { z } from "zod";
import { prisma } from "../../../database";
import { THandler } from "../../../typings/handler";
import { sign } from "hono/jwt";
import crypto from "crypto";

const scheme = z.object({
    username: z.string().max(32),
    email: z.string().email(),
    password: z.string().max(64).transform((r) => crypto.createHash("sha256").update(r).digest('hex'))
})

export const post: THandler<"/auth/sign-up"> = async (c) => {

    const body = await scheme.parseAsync(await c.req.json().catch(() => null)).catch((error) => ({ error }));

    if ("error" in body) {
        return c.json({
            ok: false,
            error: body.error
        }, 400);
    }

    let user = await prisma.user.create({
        data: {
            username: body.username,
            email: body.email,
            password_hash: body.password
        },
        select: {
            id: true,
            username: true,
            email: true
        }
    }).catch((error) => ({ error }));


    if ("error" in user) {
        return c.json({
            ok: false,
            error: {
                code: 10_001,
                message: "Fields must be unique",
                fields: user.error.meta.target // ["username", "email"]
            }
        }, 400)
    }

    const token = await sign({
        id: user.id
    }, process.env.AUTH_SECRET!).then((t) => t.toUpperCase());

    return c.json({
        ok: true,
        data: {
            ...user,
            token
        }
    });
}