import bearer from "@elysiajs/bearer";
import { Elysia } from "elysia";
import { Conversation } from "./types";
import { Gemini } from "./llms/Gemini";
import { Claude } from "./llms/Claude";
import { OpenAi } from "./llms/OpenAi";

const app = new Elysia()
  .use(bearer())
  .post("/api/v1/chat/completions", async ({ bearer, body }) => {
    const model = body.model;
    const [companyName, providerModelName] = model.split("/")[1];
    if (companyName === "google") {
      const response = await Gemini.chat(providerModelName, body.messages)
      return response
    }
    if (companyName === "openai") {
      const response = await OpenAi.chat(providerModelName, body.messages)
      return response
    }
    if (companyName === "anthropic") {
      const response = await Claude.chat(providerModelName, body.messages)
      return response
    }
  }, {
    body: Conversation
  }).listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
