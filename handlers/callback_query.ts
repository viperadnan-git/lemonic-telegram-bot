import { INVALID_PROVIDER_TEXT, TRACK_NOT_AVAILABLE_TEXT } from "../constants";
import {
    spotifyAlbumHandler,
    spotifyPlaylistHandler,
} from "../modules/methods/spotifyHandlers";

import { BotContext } from "../modules/types";
import createSearchResults from "../modules/methods/createSearchResults";
import lemonic from "../modules/lemonic";
import replyWithSong from "../modules/methods/replyWithSong";

export default async function callback_query_handler(ctx: BotContext) {
    const query = ctx.callbackQuery?.data;

    if (!query) {
        return;
    }

    const [provider, id, suffix] = query.split("----", 3);

    if (provider === "spotify") {
        if (suffix === "track") {
            const data = await lemonic(id);
            if (data.url) {
                await replyWithSong(ctx, id, data.url, {
                    message: ctx.callbackQuery?.message,
                });
            } else {
                await ctx.answerCallbackQuery({
                    text: TRACK_NOT_AVAILABLE_TEXT,
                    show_alert: false,
                    cache_time: 10,
                });
            }
        } else if (suffix === "album") {
            await spotifyAlbumHandler(ctx, id, { message: ctx.msg });
        } else if (suffix === "album-dl") {
            await spotifyAlbumHandler(ctx, id, { message: ctx.msg, upload: true });
        } else if (suffix === "playlist") {
            await spotifyPlaylistHandler(ctx, id, { message: ctx.msg });
        } else if (suffix === "playlist-dl") {
            await spotifyPlaylistHandler(ctx, id, { message: ctx.msg, upload: true });
        } else {
            await ctx.answerCallbackQuery({
                text: INVALID_PROVIDER_TEXT + suffix,
                show_alert: true,
                cache_time: 10,
            });
        }
    } else if (provider === "n") {
        const [type, offset] = suffix.split("-");
        const { text, inline_keyboard } = await createSearchResults(
            id,
            type,
            parseInt(offset)
        );

        await ctx.editMessageText(text, {
            reply_markup: {
                inline_keyboard,
            },
        });
    } else {
        await ctx.answerCallbackQuery({
            text: INVALID_PROVIDER_TEXT + provider,
            show_alert: true,
            cache_time: 10,
        });
    }
}
