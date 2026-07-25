import { prisma } from "./index";

async function main() {
  const openai = await prisma.company.create({
    data: { name: "OpenAI", website: "https://openai.com" },
  });
  const anthropic = await prisma.company.create({
    data: { name: "Anthropic", website: "https://anthropic.com" },
  });
  const google = await prisma.company.create({
    data: { name: "Google", website: "https://cloud.google.com" },
  });

  const openaiProvider = await prisma.provider.create({
    data: { name: "OpenAI", website: "https://api.openai.com" },
  });
  const claudeProvider = await prisma.provider.create({
    data: { name: "Claude API", website: "https://api.anthropic.com" },
  });
  const geminiProvider = await prisma.provider.create({
    data: { name: "Google API", website: "https://generativelanguage.googleapis.com" },
  });

  const modelDefs = [
    { name: "GPT-4o", slug: "openai/gpt-4o", companyId: openai.id },
    { name: "GPT-4o Mini", slug: "openai/gpt-4o-mini", companyId: openai.id },
    { name: "GPT-4 Turbo", slug: "openai/gpt-4-turbo", companyId: openai.id },
    { name: "GPT-3.5 Turbo", slug: "openai/gpt-3.5-turbo", companyId: openai.id },
    { name: "Claude 3.5 Sonnet", slug: "anthropic/claude-3.5-sonnet", companyId: anthropic.id },
    { name: "Claude 3 Opus", slug: "anthropic/claude-3-opus", companyId: anthropic.id },
    { name: "Claude 3 Sonnet", slug: "anthropic/claude-3-sonnet", companyId: anthropic.id },
    { name: "Claude 3 Haiku", slug: "anthropic/claude-3-haiku", companyId: anthropic.id },
    { name: "Gemini 1.5 Pro", slug: "google/gemini-1.5-pro", companyId: google.id },
    { name: "Gemini 1.5 Flash", slug: "google/gemini-1.5-flash", companyId: google.id },
    { name: "Gemini 2.0 Flash", slug: "google/gemini-2.0-flash", companyId: google.id },
  ];

  for (const m of modelDefs) {
    const model = await prisma.model.create({ data: m });
    const providerId =
      model.companyId === openai.id
        ? openaiProvider.id
        : model.companyId === anthropic.id
          ? claudeProvider.id
          : geminiProvider.id;

    await prisma.modelProviderMapping.create({
      data: {
        modelId: model.id,
        providerId,
        inputTokenCost: 1,
        outputTokenCost: 2,
      },
    });
  }

  console.log("Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
