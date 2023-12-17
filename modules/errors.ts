import { BotContext } from "./types";
import { Message } from "grammy/types";

export const handleSpotifyError = (
    ctx: BotContext,
    error: any,
    others?: { message?: Message }
) => {
    let text = "Something went wrong";

    const error_text = error.message.matchAll(/"message"\s*:\s*"(.+?)"/gim);
    if (error_text) {
        text = error_text.next()?.value[1];
    } else if (error.message) {
        text = error.message;
    }

    if (others?.message) {
        const message = others.message;
        ctx.api.editMessageText(message.chat.id, message.message_id, text);
    } else if (ctx.callbackQuery) {
        ctx.answerCallbackQuery({
            text,
            show_alert: true,
            cache_time: 30,
        });
    } else {
        ctx.reply(text);
    }
};
