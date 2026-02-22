import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

export function getApiKey(): string {
  const key = process.env.TRANSISTOR_API_KEY;
  if (!key) {
    throw new Error(
      "TRANSISTOR_API_KEY is required. Set it in .env or as an environment variable.\n" +
        "Get your API key at https://dashboard.transistor.fm/account"
    );
  }
  return key;
}
