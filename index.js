import fs from "fs";
import getPostmanCollection from "./utils/postmanFetch.js";
import { generateDocs } from "./utils/markdownGeneration.js";


export default async function postmanToMarkdown(url, path) {
	const postmanRes = await getPostmanCollection(url);
	const markdown = generateDocs(postmanRes);

	fs.writeFileSync(path, markdown);
}