# Lemonic Telegram Bot

Lemonic is a powerful Telegram bot that allows you to download, stream, and search for music files and albums across different platforms, all within the convenience of your Telegram app. It leverages the capabilities of the [grammy.dev](https://grammy.dev/) library to provide a seamless and efficient user experience.

## Features

-   **Download Music**: Lemonic allows you to download your favorite tracks directly to your device.
-   **Stream Music**: Don't want to download? No problem! You can stream music directly within Telegram.
-   **Search Music**: Lemonic can search for music files and albums across various platforms, bringing a world of music to your fingertips.
-   **Download Playlists**: Lemonic can download entire playlists from YouTube, Deezer, Spotify etc.
-   **Download Albums**: Lemonic can download entire albums from YouTube, Deezer, Spotify etc.

## Getting Started

To start using Lemonic, you need to have Telegram installed on your device. Once you have that, follow these steps:

1. Open Telegram and search for "Lemonic Bot".
2. Click on the bot to start a chat.
3. Use the commands provided by the bot to download, stream, or search for music.

## Commands

-   `<song name>`: Download a song.
-   `search <song name>`: Search for a song.
-   `search <album name>`: Search for an album.
-   `search <playlist name>`: Search for a playlist.
-   `<url>`: A link to a song, album, or playlist.

## Configuration

Lemonic is configured using environment variables. The following environment variables are required:

- `SPOTIFY_CLIENT_ID`: The Spotify client ID.
- `SPOTIFY_CLIENT_SECRET`: The Spotify client secret.
- `LEMONIC_API`: The Lemonic API url.
- `BOT_TOKEN`: (Optional) The Telegram bot token. If not provided, only webhooks will be used. You have to set up the webhooks manually.
- `WEBHOOK_URL`: (Optional) The base url where this service is hosted. If not provided, the bot will use polling instead of webhooks.
- `PORT`: (Optional) The port to listen on. Defaults to 3000.
- `HOST`: (Optional) The host to listen on. Defaults to 0.0.0.0.

## Development

Lemonic is built using TypeScript and the grammy.dev library. If you're interested in contributing to the project, you can clone the repository and install the dependencies with npm.

```bash
git clone https://github.com/viperadnan-git/lemonic-telegram-bot.git
cd lemonic-telegram-bot
npm install
```

To start the server, use the following command:

```bash
npm start
```

If you want use bun, which is recommended for development, you can use the following command:

```bash
bun run start
```

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue. If you'd like to contribute to the project, please open a pull request.

## License

Lemonic is licensed under the [MIT License](./LICENSE).

## Disclaimer

Lemonic is not affiliated with Telegram or any of the platforms it uses to search for music. It is intended for educational purposes only. For music downloads, please ensure that you have the necessary permissions to download the music files.
