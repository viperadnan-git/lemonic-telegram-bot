import {
    Page,
    PlaylistedTrack,
    SimplifiedTrack,
} from "@spotify/web-api-ts-sdk";

import { BotContext } from "../types";
import lemonic from "../lemonic";
import replyWithSong from "./replyWithSong";
import replyWithSongNotAvailable from "./replyWithSongNotAvailable";

export default async function replyWithMutlipleSongs(
    ctx: BotContext,
    tracks: Page<PlaylistedTrack> | Page<SimplifiedTrack>,
    others?: { disable_notification: boolean }
) {
    for (const _track of tracks.items) {
        const track = _track?.track ?? _track;

        if (typeof track === "boolean") return;

        const download_data = await lemonic(track.id);
        if (download_data && download_data.url) {
            await replyWithSong(ctx, track, download_data.url, {
                disable_notification: others?.disable_notification ?? true,
            });
        } else {
            await replyWithSongNotAvailable(ctx, track, {
                disable_notification: others?.disable_notification ?? true,
            });
        }
    }
}
