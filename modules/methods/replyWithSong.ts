import { Episode, Track } from "@spotify/web-api-ts-sdk";

import { BotContext } from "../types";
import { InputFile } from "grammy";
import { Message } from "grammy/types";
import { PLEASE_WAIT_TEXT } from "../../constants";
import { mapArtists } from "./utils";
import spotify from "../spotify";

export default async function replyWithSong(
    ctx: BotContext,
    spotify_song: string | Track | Episode,
    url: string,
    others?: {
        message?: Message;
        disable_notification?: boolean;
    }
) {
    let message = others?.message;
    const disable_notification = others?.disable_notification ?? false;

    try {
        await ctx.replyWithAudio(url, { disable_notification });
    } catch (error: any) {
        if (
            error.description ===
                "Bad Request: wrong file identifier/HTTP URL specified" ||
            error.description === "Bad Request: failed to get HTTP URL content"
        ) {
            if (!message) {
                message = await ctx.reply(PLEASE_WAIT_TEXT, {
                    disable_notification,
                });
            } else if (message && message.text !== PLEASE_WAIT_TEXT) {
                await ctx.api.editMessageText(
                    message.chat.id,
                    message.message_id,
                    PLEASE_WAIT_TEXT
                );
            }

            const file = new InputFile({ url });

            if (typeof spotify_song === "string") {
                spotify_song = await spotify.tracks.get(spotify_song);
            }

            const performer =
                "artists" in spotify_song
                    ? mapArtists(spotify_song.artists)
                    : spotify_song.show.name;
            await ctx.replyWithAudio(file, {
                title: spotify_song.name,
                performer: performer,
                duration: spotify_song.duration_ms / 1000,
                disable_notification,
            });
        } else {
            console.error(error);
        }
    } finally {
        if (message) {
            await ctx.api.deleteMessage(message.chat.id, message.message_id);
        }
    }
}
