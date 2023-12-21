import {
    spotifyAlbumHandler,
    spotifyPlaylistHandler,
} from "../modules/methods/spotifyHandlers";

import { BotContext } from "../modules/types";
import { Message } from "grammy/types";
import { PLEASE_WAIT_TEXT } from "../constants";
import SongLink from "../modules/songlink";
import lemonic from "../modules/lemonic";
import replyWithSong from "../modules/methods/replyWithSong";
import replyWithSongNotAvailable from "../modules/methods/replyWithSongNotAvailable";
import spotify from "../modules/spotify";

const songlink = new SongLink();

export default async function url_message_handler(ctx: BotContext) {
    const pos = ctx.message?.entities?.find(
        (entity) => entity.type === "text_link" || entity.type === "url"
    );
    const url =
        pos?.type === "text_link"
            ? pos.url
            : ctx.message?.text?.slice(
                  pos?.offset ?? 0,
                  (pos?.offset ?? 0) + (pos?.length ?? -1)
              );

    if (!url) {
        return;
    }

    if (
        url?.match(/(http|https):\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/)
    ) {
        await spotifyTrackHandler(ctx, url);
    } else if (
        url?.match(
            /(http|https):\/\/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/
        )
    ) {
        const spotify_id = url.split("/").pop()!;
        await spotifyPlaylistHandler(ctx, spotify_id);
    } else if (
        url?.match(/(http|https):\/\/open\.spotify\.com\/album\/([a-zA-Z0-9]+)/)
    ) {
        const spotify_id = url.split("/").pop()!;
        await spotifyAlbumHandler(ctx, spotify_id);
    } else {
        await unknownUrlHandler(ctx, url);
    }
}

const spotifyTrackHandler = async (
    ctx: BotContext,
    url: string,
    others?: { message?: any; disable_notification?: boolean }
) => {
    const spotify_id = url.split("/").pop()!;
    const download_data = await lemonic(spotify_id);
    if (download_data.url) {
        await replyWithSong(ctx, spotify_id, download_data.url, others);
    } else {
        const track = await spotify.tracks.get(spotify_id);
        await replyWithSongNotAvailable(ctx, track, others);
    }
};

const unknownUrlHandler = async (
    ctx: BotContext,
    url: string,
    others?: { message?: Message }
) => {
    let message = others?.message;
    if (!message) message = await ctx.reply(PLEASE_WAIT_TEXT);
    const data: { [key: string]: string } | undefined =
        await songlink.find_provider("spotify", url);
    if (data) {
        const spotify_id = data.id;

        const download_data = await lemonic(spotify_id);
        if (download_data.url) {
            await replyWithSong(ctx, spotify_id, download_data.url, {
                message,
            });
        } else {
            const track = await spotify.tracks.get(spotify_id);
            await replyWithSongNotAvailable(ctx, track, { message });
        }
    } else {
        await ctx.api.editMessageText(
            message.chat.id,
            message.message_id,
            "No result found"
        );
    }
};
