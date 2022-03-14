import path from 'path'
import fs from 'fs/promises'
import parseFrontMatter from 'front-matter'
import invariant from "tiny-invariant";
import { marked } from "marked";


export type Post = {
    slug: string;
    title: string;
};

export type PostMarkdownAttributes = {
  title: string;
};
export type NewPost = {
  title: string;
  slug: string;
  markdown: string;
};


const postPath = path.join(__dirname, '../posts')

function isValidPostAttributes(attributes: any ): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

const getPosts = async ( ) => {
    const dir = await fs.readdir(postPath)
    return Promise.all(dir.map(async (filename) => {

        const file = await fs.readFile(path.join(postPath, filename))
        const { attributes } = parseFrontMatter(file.toString())

        invariant(isValidPostAttributes(attributes), `Invalid post attributes: ${JSON.stringify(attributes)}`)

        return {
            slug: filename.replace('.md', ''),
            title: attributes.title,
        }
    }))
}

export const getPost = async (slug: string) => {
    const filePath = path.join(postPath, slug + ".md")
    const file = await fs.readFile(filePath);


    console.log('file', file)

    const { attributes, body } = parseFrontMatter(file.toString())

    invariant(isValidPostAttributes(attributes), `Invalid post attributes: ${JSON.stringify(attributes)}`)

    console.log('body', body, 'end')
    const html = marked(body)


    console.log('html', html)

    return {
        slug,
        html,
        title: attributes.title,
    }
}

const createPost = async (post: NewPost)  => {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  await fs.writeFile(path.join(postPath, post.slug + ".md"), md);
  return getPost(post.slug);
}


export {
    getPosts,
    createPost
}