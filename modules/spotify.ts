import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "../constants";

import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const spotify = SpotifyApi.withClientCredentials(
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET
);

export default spotify;
