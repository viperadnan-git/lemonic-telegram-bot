import { BotContext } from "../modules/types";
import { InputMediaBuilder } from "grammy";
import lemonic from "../modules/lemonic";

export default async function chosen_inline_result_handler(ctx: BotContext) {
    if (ctx.inlineMessageId && ctx?.chosenInlineResult?.result_id) {
        const data = await lemonic(ctx.chosenInlineResult.result_id);
        if (data.url) {
            const audio = InputMediaBuilder.audio(data.url);
            try {
                await ctx.api.editMessageMediaInline(
                    ctx.inlineMessageId,
                    audio
                );
            } catch (error: any) {
                if (error.description !== "Bad Request: MEDIA_EMPTY" &&
                    error.description !== "Bad Request: failed to get HTTP URL content") {
                    throw error;
                }
            }
        }
    }
}
