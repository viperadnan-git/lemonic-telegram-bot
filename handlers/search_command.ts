import { BotContext } from "../modules/types";
import { SEARCH_HELP_TEXT } from "../constants";
import createSearchResults from "../modules/methods/createSearchResults";

export async function searchQueryHandler(
    ctx: BotContext,
    query: string,
    type: string = "t"
) {
    if (query.length > 50) {
        query = query.substring(0, 50);
    }

    const { text, inline_keyboard } = await createSearchResults(query, type);

    await ctx.reply(text, {
        reply_markup: {
            inline_keyboard,
        },
    });
}

export default async function search_command_handler(ctx: BotContext) {
    if (ctx.match) {
        let query;
        if (typeof ctx.match === "string") {
            query = ctx.match;
        } else {
            query = ctx.match[0].substring(7);
        }

        let type = "t";
        const [_type] = query.split(" ", 1);

        switch (_type) {
            case "album":
                type = "a";
                query = query.substring(6);
                break;
            case "playlist":
                type = "p";
                query = query.substring(9);
                break;
            case "track":
                type = "t";
                query = query.substring(6);
                break;
            default:
                break;
        }

        if (!query) {
            await ctx.reply(SEARCH_HELP_TEXT);
        } else {
            await searchQueryHandler(ctx, query, type);
        }
    } else {
        await ctx.reply(SEARCH_HELP_TEXT);
    }
}
