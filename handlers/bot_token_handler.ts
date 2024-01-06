import { WEBHOOK_URL, bots } from "../constants";

import { BotContext } from "../modules/types";
import { MessageEntity } from "grammy/types";
import botCreator from "../bot";

function extractBotToken(msgText: string, entities: Array<MessageEntity>) {
    for (const entity_ in entities) {
        const entity = entities[Number(entity_)];
        if (entity.type == "code") {
            return msgText?.substring(
                entity.offset,
                entity.offset + entity.length
            );
        }
    }
}

export default async function bot_token_handler(ctx: BotContext) {
    if (!WEBHOOK_URL) {
        await ctx.reply("I am a bot too!");
        return;
    }

    const entities = ctx.message?.entities || [];
    const msgText = ctx.message?.text || "";

    const bot_token = extractBotToken(msgText, entities);
    if (bot_token !== undefined) {
        let bot = bots.get(bot_token);
        if (!bot) {
            bot = botCreator(bot_token);
            try {
                await bot.api.setWebhook(
                    (WEBHOOK_URL + "/bot" + bot_token) as string,
                    {
                        drop_pending_updates: true,
                    }
                );
                await ctx.reply("Bot cloned successfully");
            } catch (error: any) {
                console.error(`Error in while setting webhook: ${error}`);
                await ctx.reply(
                    `An error has occurred when setting webhook: <code>${error.message}</code>\n\nPlease contact the bot developer or set the webhook manually to ${WEBHOOK_URL}/bot${bot_token}`
                );
            }
        } else {
            await ctx.reply("Bot is already cloned");
        }
    } else {
        await ctx.reply("Invalid message from @BotFather");
    }
}
