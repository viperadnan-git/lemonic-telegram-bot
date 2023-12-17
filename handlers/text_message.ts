import { BotContext } from "../modules/types";
import { handleSpotifyError } from "../modules/errors";
import lemonic from "../modules/lemonic";
import replyWithSong from "../modules/methods/replyWithSong";
import replyWithSongNotAvailable from "../modules/methods/replyWithSongNotAvailable";
import spotify from "../modules/spotify";

export async function queryHandler(ctx: BotContext, query: string | undefined) {
    if (!query) {
        return;
    }

    if (query.length > 100) {
        query = query.substring(0, 100);
    }

    let searchResult;
    try {
        searchResult = await spotify.search(query, ["track"], "IN", 1);
    } catch (error) {
        handleSpotifyError(ctx, error);
        return;
    }

    const track = searchResult.tracks.items[0];

    if (track) {
        const data = await lemonic(track.id);
        if (data.url) {
            await replyWithSong(ctx, track, data.url);
        } else {
            await replyWithSongNotAvailable(ctx, track);
        }
    } else {
        await ctx.reply("No result found");
    }
}

export default async function text_message_handler(ctx: BotContext) {
    let query = ctx?.message?.text?.trim();
    await queryHandler(ctx, query);
}
