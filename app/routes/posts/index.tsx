import { Link, LoaderFunction, useLoaderData } from "remix";
import { getPosts, Post } from "~/post";

export const loader: LoaderFunction = async () => {
    const posts = await getPosts();
    return posts;
};

export default function Posts() {
    const posts = useLoaderData<Post[]>();
    console.log(posts);
    return (
        <main>
            <h1>Posts</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.slug}>
                        <Link to={post.slug}>
                            <a>{post.title}</a>
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
