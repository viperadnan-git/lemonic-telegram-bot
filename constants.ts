import { Bot } from "grammy";
import { BotContext } from "./modules/types";

export const bots = new Map<string, Bot<BotContext>>();
export const WEBHOOK_URL =
    process.env.WEBHOOK_URL && process.env.WEBHOOK_URL.endsWith("/")
        ? process.env.WEBHOOK_URL.slice(0, -1)
        : process.env.WEBHOOK_URL;
export const BOT_TOKEN = process.env.BOT_TOKEN;
export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
export const LEMONIC_API = process.env.LEMONIC_API;

export const PLEASE_WAIT_TEXT = "Please wait...";
export const INVALID_SPOTIFY_ID_TEXT = "Invalid Spotify ID";
export const INVALID_PROVIDER_TEXT = "Invalid provider: ";
export const TRACK_NOT_AVAILABLE_TEXT =
    "Track is still being processed. Please try again later.";
export const TRACK_NOT_AVAILABLE_MESSAGE =
    "This track will be added within 5 minutes.";
export const SEARCH_HELP_TEXT =
    "You can search for tracks, albums and playlists.\n\nTrack search example:\n<pre>search (track name)</pre><pre>search track (track name)</pre>\nAlbum search example:\n<pre>search album (album name)</pre>\nPlaylist search example:\n<pre>search playlist (playlist name)</pre>\n\nThe search query is case-insensitive so you don't have to worry about captial and small letters. You can also search for tracks in inline mode.";
export const CHECK_AGAIN_TEXT = "Check Again";
export const CLONE_BOT_BUTTON = {
    text: "Clone Bot",
    url: "https://telegra.ph/Create-Your-Own-Lemonic-Bot-A-Step-by-Step-Guide-12-16",
};

export const HOST = process.env.HOST ? process.env.HOST : process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
