import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import matter from "gray-matter";
import OpenAI from "openai";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Frontmatter {
  title: string;
  description: string;
  date: string;
  category: string;
  subcategory?: string;
  tags: string[];
  published?: boolean;
}

function sanitizePlainText(text: string): string {
  let value = text.trim();

  value = value.replace(/^```(?:yaml|yml|text|mdx|markdown)?\s*\n?/i, "");
  value = value.replace(/\n?```$/i, "");
  value = value.replace(/^(title|description)\s*:\s*/i, "");
  value = value.replace(/^["']|["']$/g, "");

  return value.trim();
}

function escapeYamlString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function serializeFrontmatter(data: Frontmatter): string {
  const lines = [
    "---",
    `title: "${escapeYamlString(data.title)}"`,
    `description: "${escapeYamlString(data.description)}"`,
    `date: "${data.date}"`,
    `category: "${data.category}"`,
  ];

  if (data.subcategory) {
    lines.push(`subcategory: "${data.subcategory}"`);
  }

  lines.push(`tags: [${data.tags.map((tag) => `"${tag}"`).join(", ")}]`);
  lines.push(`published: ${data.published !== false}`);
  lines.push("---", "");

  return lines.join("\n");
}

function protectContent(text: string): { text: string; placeholders: Map<string, string> } {
  const placeholders = new Map<string, string>();
  let index = 0;

  const protect = (pattern: RegExp, input: string): string =>
    input.replace(pattern, (match) => {
      const key = `__KEEP_${index++}__`;
      placeholders.set(key, match);
      return key;
    });

  let protectedText = text;
  protectedText = protect(/```[\s\S]*?```/g, protectedText);
  protectedText = protect(/`[^`\n]+`/g, protectedText);
  protectedText = protect(/!\[[^\]]*\]\([^)]+\)/g, protectedText);
  protectedText = protect(/<[^>\n]+>/g, protectedText);
  protectedText = protect(/https?:\/\/[^\s)>\]]+/g, protectedText);

  return { text: protectedText, placeholders };
}

function restoreContent(text: string, placeholders: Map<string, string>): string {
  let restored = text;
  for (const [key, value] of placeholders) {
    restored = restored.replaceAll(key, value);
  }
  return restored;
}

function sanitizeBody(text: string): string {
  let value = text.trim();
  value = value.replace(/^```(?:mdx|markdown|md)?\s*\n?/i, "");
  value = value.replace(/\n?```$/i, "");
  return value.trim();
}

async function translateFrontmatter(
  frontmatter: Frontmatter
): Promise<Pick<Frontmatter, "title" | "description">> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Translate Korean blog frontmatter fields to natural English. Return JSON only with keys title and description. Do not translate tags, category, or date.",
      },
      {
        role: "user",
        content: JSON.stringify({
          title: frontmatter.title,
          description: frontmatter.description,
        }),
      },
    ],
    temperature: 0.2,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Failed to translate frontmatter: empty response");
  }

  const parsed = JSON.parse(raw) as { title?: string; description?: string };
  if (!parsed.title || !parsed.description) {
    throw new Error("Failed to translate frontmatter: missing title or description");
  }

  return {
    title: sanitizePlainText(parsed.title),
    description: sanitizePlainText(parsed.description),
  };
}

async function translateBody(body: string): Promise<string> {
  if (!body.trim()) {
    return body;
  }

  const { text: protectedBody, placeholders } = protectContent(body);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Translate Korean markdown/MDX body text to natural, professional English. Keep placeholders like __KEEP_0__ exactly unchanged. Preserve markdown structure, headings, lists, emphasis, and blank lines. Return only the translated body text.",
      },
      {
        role: "user",
        content: protectedBody,
      },
    ],
    temperature: 0.2,
  });

  const translated = response.choices[0]?.message?.content;
  if (!translated) {
    throw new Error("Failed to translate body: empty response");
  }

  return restoreContent(sanitizeBody(translated), placeholders);
}

async function main() {
  const koFilePath = process.argv[2];
  if (!koFilePath || !koFilePath.includes("/ko/") || !koFilePath.endsWith(".mdx")) {
    console.error("Usage: tsx scripts/translate-post.ts <ko-mdx-path>");
    process.exit(1);
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY in .env.local");
    process.exit(1);
  }

  const fileContent = fs.readFileSync(koFilePath, "utf8");
  const { data, content: body } = matter(fileContent);
  const frontmatter = data as Frontmatter;

  const translatedFrontmatter = await translateFrontmatter(frontmatter);
  const translatedBody = await translateBody(body);

  const newFrontmatter: Frontmatter = {
    ...frontmatter,
    ...translatedFrontmatter,
  };

  const newContent = serializeFrontmatter(newFrontmatter) + translatedBody;
  const enFilePath = koFilePath.replace("/ko/", "/en/");
  const enDir = path.dirname(enFilePath);

  if (!fs.existsSync(enDir)) {
    fs.mkdirSync(enDir, { recursive: true });
  }

  fs.writeFileSync(enFilePath, newContent, "utf8");
  console.log(`Translated: ${enFilePath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
