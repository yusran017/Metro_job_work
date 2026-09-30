import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const docs = join(process.cwd(), "docs");
const page = join(docs, "pages.html");
if (!existsSync(page)) {
  console.error("docs/pages.html missing");
  process.exit(1);
}
copyFileSync(page, join(docs, "index.html"));
copyFileSync(page, join(docs, "404.html"));
