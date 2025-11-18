import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteDir = path.resolve(__dirname, "../app/(site)");
const outputFile = path.resolve(__dirname, "metadata.ts");

function walk(dir: string, baseRoute = "") {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const map: Record<string, string> = {};

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			const subMap = walk(fullPath, `${baseRoute}/${entry.name}`);
			Object.assign(map, subMap);
		} else if (entry.name === "page.tsx") {
			map[baseRoute || "/"] = `@/app/(site)${baseRoute}/page`;
		}
	}

	return map;
}

const routeMap = walk(siteDir);

const lines = [
	"// This file is generated automatically. Do not edit it manually.",
	'import { LintIgnoredAny } from "@/libs/stp@types";',
	"",
	"export const metadataMap: Record<string, () => Promise<LintIgnoredAny>> = {",
	...Object.entries(routeMap).map(
		([route, filePath]) => `  '${route}': () => import('${filePath}'),`
	),
	"};",
	"",
];

fs.writeFileSync(outputFile, lines.join("\n"), "utf-8");
console.log(`metadata.ts successfully generated in ${outputFile}`);
