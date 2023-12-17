import { CHECK_AGAIN_TEXT, INVALID_SPOTIFY_ID_TEXT } from "../../constants";
import { Episode, Track } from "@spotify/web-api-ts-sdk";

import { BotContext } from "../types";
import { Message } from "grammy/types";
import spotify from "../spotify";
import { trackNotAvailableMessage } from "./utils";

export default async function replyWithSongNotAvailable(
    ctx: BotContext,
    spotify_song: string | Track | Episode,
    others?: { message?: Message; disable_notification?: boolean }
) {
    if (typeof spotify_song === "string") {
        try {
            spotify_song = await spotify.tracks.get(spotify_song);
        } catch (error: any) {
            if (error.message.includes("invalid id")) {
                if (others?.message) {
                    const message = others.message;
                    await ctx.api.editMessageText(
                        message.chat.id,
                        message.message_id,
                        INVALID_SPOTIFY_ID_TEXT
                    );
                } else {
                    await ctx.reply(INVALID_SPOTIFY_ID_TEXT);
                }
            } else {
                console.error(error);
            }
            return;
        }
    }

    const reply_markup = {
        inline_keyboard: [
            [
                {
                    text: CHECK_AGAIN_TEXT,
                    callback_data: `spotify----${spotify_song.id}----track`,
                },
            ],
        ],
    };

    if (others?.message) {
        const message = others.message;
        await ctx.api.editMessageText(
            message.chat.id,
            message.message_id,
            trackNotAvailableMessage(spotify_song),
            {
                reply_markup,
            }
        );
    } else {
        await ctx.replyWithHTML(trackNotAvailableMessage(spotify_song), {
            disable_notification: others?.disable_notification ?? false,
            reply_markup,
        });
    }
}
