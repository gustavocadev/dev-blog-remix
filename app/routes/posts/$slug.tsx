import type { LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import { getPost } from "~/post";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ params }) => {
    invariant(params.slug, "params.slug is required");
    return await getPost(params.slug);
};

export default function PostSlug() {
    const post = useLoaderData();
    return (
        <>
            <main dangerouslySetInnerHTML={{ __html: post.html }} />
        </>
    );
}
