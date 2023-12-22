import {
    Album,
    Artist,
    Episode,
    Playlist,
    SimplifiedAlbum,
    SimplifiedArtist,
    SimplifiedPlaylist,
    Track,
} from "@spotify/web-api-ts-sdk";

import { TRACK_NOT_AVAILABLE_MESSAGE } from "../../constants";

export const mapArtists = (artists: Artist[] | SimplifiedArtist[]) =>
    artists.map((artist) => artist.name).join(", ");

export const mapTrack = (track: Track | Episode) => {
    if ("artists" in track) {
        return `<b>${track.name}</b> - ${mapArtists(track.artists)}`;
    }
    return `<b>${track.name}</b> - ${track.show.name}`;
};

export const mapAlbum = (album: Album | SimplifiedAlbum) => {
    return `<b>${album.name}</b> - ${mapArtists(album.artists)}`;
};

export const mapPlaylist = (playlist: Playlist | SimplifiedPlaylist | any) => {
    return `<b>${playlist.name}</b> - ${playlist.owner.display_name}`;
};

export const trackNotAvailableMessage = (track: Track | Episode) => {
    return `${mapTrack(track)}\n${TRACK_NOT_AVAILABLE_MESSAGE}`;
};

export const albumMessage = (album: Album) => {
    return `<b><a href="${album.external_urls.spotify}">${
        album.name
    }</a></b>\n<i>${album.artists.map((artist) => artist.name).join(", ")}</i>\n\n${
        album.label
    }`;
};

export const playlistMessage = (playlist: Playlist) => {
    return `<b><a href="${playlist.external_urls.spotify}">${playlist.name}</a></b>\n<i>${playlist.owner.display_name}</i>\n\n${playlist.description}`;
};

interface SearchResult {
    id: string;
    name: string;
    index: number;
}

export const searchResultMessage = (
    query: string,
    type: string,
    items: SearchResult[]
) => {
    return `🔍 Search results for ${type}: <b>${query}</b>\n\n${items
        .map((item) => `${item.index}. ${item.name}`)
        .join("\n")}`;
};

export const create3x4Image = (url: string) =>
    `https://wsrv.nl/?url=${encodeURIComponent(
        url
    )}&w=1137&h=640&q=100&fit=contain&l=0&cbg=121212`;
