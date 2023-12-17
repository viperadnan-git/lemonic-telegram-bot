import { Context } from "grammy";
import { ParseModeFlavor } from "@grammyjs/parse-mode";

export type BotContext = Context & ParseModeFlavor<Context>;
