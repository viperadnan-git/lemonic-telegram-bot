export default class SongLink {
    LINK_REGEX: RegExp;
    providers: {
        spotify: string[];
        apple: string[];
        youtube: string[];
        youtube_music: string[];
        soundcloud: string[];
        deezer: string[];
        tidal: string[];
        pandora: string[];
        amazon: string[];
        napster: string[];
        yandex: string[];
        audiomack: string[];
        boomplay: string[];
        anghami: string[];
    };

    constructor() {
        this.LINK_REGEX = new RegExp(
            /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gm
        );
        this.providers = {
            spotify: ["open.spotify.com"],
            apple: [
                "music.apple.com",
                "itunes.apple.com",
                "geo.music.apple.com",
                "geo.itunes.apple.com",
            ],
            youtube: [
                "youtube.com",
                "youtu.be",
                "www.youtube.com",
                "www.youtu.be",
            ],
            youtube_music: ["music.youtube.com", "www.music.youtube.com"],
            soundcloud: ["soundcloud.com"],
            deezer: ["www.deezer.com"],
            tidal: ["listen.tidal.com"],
            pandora: ["pandora.com", "www.pandora.com"],
            amazon: ["music.amazon.com"],
            napster: ["play.napster.com"],
            yandex: ["music.yandex.ru"],
            audiomack: ["audiomack.com"],
            boomplay: ["www.boomplay.com"],
            anghami: ["play.anghami.com"],
        };
    }

    extractData(content: string) {
        const data = content.matchAll(this.LINK_REGEX); // Add 'g' flag to the regex
        const result: { [key: string]: string } = {}; // Add type annotation to result object
        if (data) {
            for (const [provider, domains] of (Object as any).entries(
                this.providers
            )) {
                for (const url of data) {
                    if (domains.includes(url[2])) {
                        result[provider] = url[0];
                        break;
                    }
                }
            }
        }
        return result;
    }

    async searchUrl(url: string) {
        return await fetch("https://song.link/" + url)
            .then((resp) => resp.text())
            .then((content) => {
                const data = this.extractData(content);
                return data;
            })
            .catch(() => {
                return {};
            });
    }

    async searchAlternateProvider(provider: string, url: string) {
        const data: { [key: string]: string } = await this.searchUrl(url);
        return data[provider] || null;
    }
}
