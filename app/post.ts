import parseFrontMatter from "front-matter";
import fs from "fs/promises";
import { marked } from "marked";
import path from "path";
import invariant from "tiny-invariant";

export type Post = {
  slug: string;
  title: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

let postsPath = path.join(__dirname, "../posts");

function isValidPostAttributes(
  attributes: unknown
): attributes is PostMarkdownAttributes {
  return (attributes as any)?.title;
}

export async function getPosts() {
  let dir = await fs.readdir(postsPath);

  return Promise.all(
    dir.map(async (filename) => {
      let file = await fs.readFile(path.join(postsPath, filename));

      let { attributes } = parseFrontMatter(file.toString());

      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );

      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title,
      };
    })
  );
}

export async function getPost(slug: string) {
  let filepath = path.join(postsPath, slug + ".md");

  let file = await fs.readFile(filepath);

  let { attributes, body } = parseFrontMatter(file.toString());

  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );

  let html = marked(body);

  return { slug, html, title: attributes.title };
}
