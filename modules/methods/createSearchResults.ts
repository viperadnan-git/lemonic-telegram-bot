import { mapAlbum, mapPlaylist, mapTrack, searchResultMessage } from "./utils";

import { ItemTypes } from "@spotify/web-api-ts-sdk";
import spotify from "../spotify";

const type_map: { [key: string]: ItemTypes } = {
    t: "track",
    a: "album",
    p: "playlist",
};

export default async function createSearchResults(
    query: string,
    type: string = "t",
    offset: number = 0,
    limit: number = 7
) {
    let real_limit = limit;
    if (offset > 0) {
        real_limit = limit - 1;
    }

    const searchResult = await spotify.search(
        query,
        [type_map[type]],
        "IN",
        real_limit as 50,
        offset
    );

    const parsedResult: { id: string; name: string; index: number }[] = [];
    let next = undefined;

    switch (type) {
        case "t":
            parsedResult.push(
                ...searchResult.tracks.items.map((track, index) => {
                    return {
                        id: track.id,
                        name: mapTrack(track),
                        index: index + 1 + offset,
                    };
                })
            );
            next = searchResult.tracks.next;
            break;
        case "a":
            parsedResult.push(
                ...searchResult.albums.items.map((album, index) => {
                    return {
                        id: album.id,
                        name: mapAlbum(album),
                        index: index + 1 + offset,
                    };
                })
            );
            next = searchResult.albums.next;
            break;
        case "p":
            parsedResult.push(
                ...searchResult.playlists.items.map((playlist, index) => {
                    return {
                        id: playlist.id,
                        name: mapPlaylist(playlist),
                        index: index + 1 + offset,
                    };
                })
            );
            next = searchResult.playlists.next;
            break;
    }

    if (!parsedResult.length) {
        return {
            text: `No result found for ${type_map[type]} <b>${query}</b>`,
            inline_keyboard: [],
        };
    }

    const inline_keyboard = [];
    let row = [];
    for (const result of parsedResult) {
        row.push({
            text: result.index.toString(),
            callback_data: `spotify----${result.id}----${type_map[type]}`,
        });
        if (row.length === 4) {
            inline_keyboard.push(row);
            row = [];
        }
    }

    if (inline_keyboard.length === 0 && row.length < 4) {
        inline_keyboard.push(row);
        row = [];
    }

    if (offset > 0) {
        row.unshift({
            text: "←",
            callback_data: `n----${query}----${type}-${
                offset === limit ? 0 : offset - real_limit
            }`,
        });
    }

    if (next) {
        row.push({
            text: "→",
            callback_data: `n----${query}----${type}-${offset + real_limit}`,
        });
    }

    if (row.length) {
        inline_keyboard.push(row);
    }

    return {
        text: searchResultMessage(query, type_map[type], parsedResult),
        inline_keyboard,
    };
}
