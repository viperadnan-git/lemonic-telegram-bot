import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "../constants";

import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const spotify = SpotifyApi.withClientCredentials(
    SPOTIFY_CLIENT_ID as string,
    SPOTIFY_CLIENT_SECRET as string
);

export default spotify;
