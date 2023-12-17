import { BotContext } from "../modules/types";
import { CLONE_BOT_BUTTON } from "../constants";
import lemonic from "../modules/lemonic";
import replyWithSong from "../modules/methods/replyWithSong";
import replyWithSongNotAvailable from "../modules/methods/replyWithSongNotAvailable";
import spotify from "../modules/spotify";

export default async function start_command_handler(ctx: BotContext) {
    if (ctx.match && typeof ctx.match === "string") {
        const [provider, id] = ctx.match.split("----", 2);
        if (provider === "spotify") {
            const data = await lemonic(id);
            if (data.url) {
                await replyWithSong(ctx, id, data.url);
            } else {
                const track = await spotify.tracks.get(id);
                await replyWithSongNotAvailable(ctx, track);
            }
        }
    } else {
        await ctx.reply(
            `Hello, I'm Lemonic Bot. I can download songs from Spotify and other music platforms. Just send me a link or search for a song.`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            CLONE_BOT_BUTTON,
                            {
                                text: "Search for a song",
                                switch_inline_query_current_chat: "",
                            },
                        ],
                    ],
                },
            }
        );
    }
}
