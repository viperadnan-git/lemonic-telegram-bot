import { BOT_TOKEN, HOST, PORT, WEBHOOK_URL, bots } from "./constants";
import { NextFunction, Request, Response } from "express";

import botCreator from "./bot";
import express from "express";
import { run } from "@grammyjs/runner";
import { webhookCallback } from "grammy";

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toLocaleString()} ${req.method} ${req.path}`);
    next();
});

app.post("/bot:token", async (req: Request, res: Response) => {
    const bot_token = req.params.token;
    let bot = bots.get(bot_token);
    if (!bot) {
        bot = botCreator(bot_token);
        bots.set(bot_token, bot);
    }

    try {
        await webhookCallback(bot, "express")(req, res);
    } catch (error: any) {
        console.error(error?.description ?? error?.message ?? error);
        res.status(200).end();
    }
});

app.get("/ping", (req: Request, res: Response) => {
    res.end("pong");
});

app.all("*", async (req: Request, res: Response) => {
    const resp = await fetch("https://example.com");
    res.setHeader("Content-Type", "text/html").end(await resp.text());
});

app.listen(PORT, HOST, () => {
    if (!WEBHOOK_URL && !BOT_TOKEN) {
        console.error("WEBHOOK_URL or BOT_TOKEN not set");
        process.exit(1);
    }

    if (!WEBHOOK_URL && BOT_TOKEN) {
        console.info("Webhook URL not set, starting bot only using polling");
        const bot = botCreator(BOT_TOKEN);
        run(bot);
    } else if (WEBHOOK_URL && !BOT_TOKEN) {
        console.warn("Bot token not set, starting webhook server only");
    } else if (WEBHOOK_URL && BOT_TOKEN) {
        console.info("Starting bot using webhook");
        const bot = botCreator(BOT_TOKEN);
        bot.api.setWebhook((WEBHOOK_URL + "/bot" + BOT_TOKEN) as string);
        bots.set(BOT_TOKEN, bot);
    }

    console.log("Server started");
});
