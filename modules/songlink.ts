import { parse } from "node-html-parser";

export default class SongLink {
    baseUrl: string;

    constructor(baseUrl: string = "https://song.link") {
        this.baseUrl = baseUrl;
    }

    get_next_data(content: string) {
        const root = parse(content);
        const next_data = root.querySelector("script#__NEXT_DATA__");
        if (!next_data) {
            throw new Error("No nextjs data found");
        }

        return JSON.parse(next_data.innerHTML);
    }

    parse(content: string) {
        const next_data = this.get_next_data(content);
        const data = next_data?.props.pageProps?.pageData;

        if (!data) {
            if (next_data.page == "/not-found") {
                throw new Error(`No search results found`);
            }
            throw new Error(`No page data found in nextjs props`);
        }

        const sections = data.sections.find(
            (s: any) => s.sectionId == "section|auto|links|listen"
        );
        const platforms: { [key: string]: { [key: string]: string } } = {};
        for (const link of sections.links) {
            if (link.uniqueId) {
                const [_, type, id] = link.uniqueId.split("|");
                platforms[link.platform] = {
                    url: link.url,
                    id,
                    type,
                };
            }
        }

        return {
            ...data.entityData,
            platforms,
        };
    }

    async _find(url: string) {
        return await fetch(url, {
            headers: {
                "Accept-Encoding": "gzip",
            },
        })
            .then((resp) => resp.text())
            .then((content) => {
                return this.parse(content);
            });
    }

    find_url(url: string) {
        return this._find(`${this.baseUrl}/${url}`);
    }

    async find_provider(provider: string, url: string) {
        try {
            const result = await this.find_url(url);
            return result.platforms[provider];
        } catch (err) {
            return undefined;
        }
    }
}
