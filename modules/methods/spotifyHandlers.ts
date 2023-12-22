import { albumMessage, create3x4Image, playlistMessage } from "./utils";

import { BotContext } from "../types";
import { InputMediaBuilder } from "grammy";
import { Message } from "grammy/types";
import { handleSpotifyError } from "../errors";
import replyWithMutlipleSongs from "./replyWithMutlipleSongs";
import spotify from "../spotify";

export async function spotifyAlbumHandler(
    ctx: BotContext,
    spotify_id: string,
    others?: { message?: Message; upload?: boolean }
) {
    let album;
    try {
        album = await spotify.albums.get(spotify_id);
    } catch (error: any) {
        handleSpotifyError(ctx, error);
        return;
    }

    if (others?.upload) {
        if (others?.message) {
            await ctx.api.editMessageCaption(
                others.message.chat.id,
                others.message.message_id,
                { caption: albumMessage(album) }
            );
        }

        await replyWithMutlipleSongs(ctx, album.tracks, {
            disable_notification: true,
        });
        await ctx.reply(`🎵 ${album.name} album downloaded`);
    } else {
        const reply_markup = {
            inline_keyboard: [
                [
                    {
                        text: `Download ${album.tracks.items.length} songs`,
                        callback_data: `spotify----${album.id}----album-dl`,
                    },
                ],
            ],
        };
        const image = create3x4Image(album.images[0].url);

        if (others?.message && others.message.media_group_id) {
            const photo = InputMediaBuilder.photo(image);
            await ctx.api.editMessageMedia(
                others.message.chat.id,
                others.message.message_id,
                photo,
                { reply_markup }
            );
        } else {
            await ctx.replyWithPhoto(image, {
                caption: albumMessage(album),
                reply_markup,
            });
            if (others?.message) {
                await ctx.api.deleteMessage(
                    others.message.chat.id,
                    others.message.message_id
                );
            }
        }
    }
}

export async function spotifyPlaylistHandler(
    ctx: BotContext,
    spotify_id: string,
    others?: { message?: Message; upload?: boolean }
) {
    let playlist;
    try {
        playlist = await spotify.playlists.getPlaylist(spotify_id);
    } catch (error: any) {
        handleSpotifyError(ctx, error);
        return;
    }

    if (others?.upload) {
        if (others?.message) {
            await ctx.api.editMessageCaption(
                others.message.chat.id,
                others.message.message_id,
                { caption: playlistMessage(playlist) }
            );
        }

        do {
            await replyWithMutlipleSongs(ctx, playlist.tracks, {
                disable_notification: true,
            });
            if (playlist.tracks.next) {
                playlist.tracks = await spotify.playlists.getPlaylistItems(
                    playlist.id,
                    undefined,
                    undefined,
                    playlist.tracks.limit as 50 | undefined,
                    playlist.tracks.offset + playlist.tracks.limit
                );
            }
        } while (playlist.tracks.next);
        await ctx.reply(`🎵 ${playlist.name} playlist downloaded`);
    } else {
        const reply_markup = {
            inline_keyboard: [
                [
                    {
                        text: `Download ${playlist.tracks.items.length} songs`,
                        callback_data: `spotify----${playlist.id}----playlist-dl`,
                    },
                ],
            ],
        };
        const image = create3x4Image(playlist.images[0].url);

        if (others?.message && others.message.media_group_id) {
            const photo = InputMediaBuilder.photo(image);
            await ctx.api.editMessageMedia(
                others.message.chat.id,
                others.message.message_id,
                photo,
                { reply_markup }
            );
        } else {
            await ctx.replyWithPhoto(image, {
                caption: playlistMessage(playlist),
                reply_markup,
            });
            if (others?.message) {
                await ctx.api.deleteMessage(
                    others.message.chat.id,
                    others.message.message_id
                );
            }
        }
    }
}
