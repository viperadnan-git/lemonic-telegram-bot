import { Bot, Composer } from "grammy";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";

import { BotContext } from "./modules/types";
import { autoRetry } from "@grammyjs/auto-retry";
import bot_token_handler from "./handlers/bot_token_handler";
import callback_query_handler from "./handlers/callback_query";
import chosen_inline_result_handler from "./handlers/chosen_inline_result";
import inline_query_handler from "./handlers/inline_query";
import search_command_handler from "./handlers/search_command";
import start_handler from "./handlers/start_command";
import text_handler from "./handlers/text_message";
import url_handler from "./handlers/url_message";

const composer = new Composer<BotContext>();
composer.use(hydrateReply);

const allChats = composer.chatType(["private", "group", "supergroup"]);
const privateChat = composer.chatType("private");

const wrapper =
    (handler: (ctx: BotContext) => Promise<void>) =>
    async (ctx: BotContext) => {
        handler(ctx).catch(async (err: any) => {
            console.error(`Error in ${handler.name}: ${err}`);
            if (!ctx.chosenInlineResult) {
                try {
                    await ctx.reply("An error has occurred. Please try again later. If this issue persists, please contact the bot developer.");
                } catch (error: any) {
                    console.error(
                        `Error in ${handler.name}: Cannot send error feedback to user (${error.message}) `
                    );
                }
            }
        });
    };

allChats.command(["start", "help", "settings"], wrapper(start_handler));
allChats.command("search", wrapper(search_command_handler));

privateChat.hears(
    /search ?((album|playlist|track) )?(.+)?/gim,
    wrapper(search_command_handler)
);
privateChat.on("message::url", wrapper(url_handler));
privateChat.on("msg:text").filter(
    // @ts-ignore
    (ctx) => ctx.msg.forward_from?.username?.toLowerCase() === "botfather",
    wrapper(bot_token_handler)
);
privateChat.on("message:text", wrapper(text_handler));

composer.on("inline_query", wrapper(inline_query_handler));
composer.on("callback_query:data", wrapper(callback_query_handler));
composer.on("chosen_inline_result", wrapper(chosen_inline_result_handler));

const botCreator = (token: string) => {
    const bot = new Bot<BotContext>(token, {
        client: {
            canUseWebhookReply: (method) => method === "sendChatAction",
        },
    });
    bot.api.config.use(parseMode("HTML"));
    bot.api.config.use(autoRetry());
    bot.use(composer);

    // this will not be caught when using webhooks
    bot.catch((err) => console.error(err));
    return bot;
};

export default botCreator;
