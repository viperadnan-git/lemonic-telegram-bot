import { BotContext } from "../modules/types";
import { InlineQueryResultBuilder } from "grammy";
import { mapArtists } from "../modules/methods/utils";
import spotify from "../modules/spotify";

export default async function inline_query_handler(ctx: BotContext) {
    const results = [];

    const query = ctx?.inlineQuery?.query.trim();
    const offset = parseInt(ctx?.inlineQuery?.offset ?? "0", 10) || 0;

    if (!query) {
        return;
    }

    const searchResult = await spotify.search(
        query,
        ["track"],
        "IN",
        10,
        offset
    );

    const ids: string[] = [];
    for (const item of searchResult.tracks.items) {
        if (ids.includes(item.id)) {
            continue;
        }
        const image = item.album.images[0];
        results.push(
            InlineQueryResultBuilder.documentPdf(
                item.id,
                item.name,
                image.url,
                {
                    description: mapArtists(item.artists),
                    thumbnail_url: image.url,
                    thumbnail_height: image.height,
                    thumbnail_width: image.width,
                    caption: `<b>${item.name}</b> - ${mapArtists(
                        item.artists
                    )}`,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Open in Lemonic Bot",
                                    url: `https://t.me/${ctx.me.username}?start=spotify----${item.id}`,
                                },
                            ],
                        ],
                    },
                }
            )
        );
        ids.push(item.id);
    }

    await ctx.answerInlineQuery(results, {
        cache_time: 3600,
        next_offset: `${offset + 10}`,
    });
}
