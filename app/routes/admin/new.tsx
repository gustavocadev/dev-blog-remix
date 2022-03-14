import {
    redirect,
    Form,
    ActionFunction,
    useLoaderData,
    useTransition,
} from "remix";

import { createPost, NewPost } from "~/post";
import invariant from "tiny-invariant";

type PostError = {
    title?: boolean;
    slug?: boolean;
    markdown?: boolean;
};

export const action: ActionFunction = async ({ request }) => {
    await new Promise((res) => setTimeout(res, 1000));

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const markdown = formData.get("markdown") as string;

    const errors: PostError = {
        title: false,
        slug: false,
        markdown: false,
    };
    if (!title) errors.title = true;
    if (!slug) errors.slug = true;
    if (!markdown) errors.markdown = true;

    const checkErrors = [...Object.values(errors)].some(Boolean);
    if (checkErrors) {
        return errors;
    }

    invariant(typeof title === "string");
    invariant(typeof slug === "string");
    invariant(typeof markdown === "string");

    await createPost({ title, slug, markdown });

    return redirect("/admin");
};

export default function NewPost() {
    const errors = useLoaderData<NewPost>();
    const transition = useTransition();
    return (
        <Form method="post">
            <p>
                <label>
                    Post Title:{" "}
                    {errors?.title ? <em>Title is required</em> : null}
                    <input
                        type="text"
                        name="title"
                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md   focus:border-blue-400  focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </label>
            </p>
            <p>
                <label>
                    Post Slug: {errors?.slug ? <em>Slug is required</em> : null}
                    <input
                        type="text"
                        name="slug"
                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md   focus:border-blue-400  focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </label>
            </p>
            <p>
                <label htmlFor="markdown">Markdown:</label>{" "}
                {errors?.markdown ? <em>Markdown is required</em> : null}
                <br />
                <textarea
                    id="markdown"
                    rows={10}
                    name="markdown"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                />
            </p>
            <p>
                <button
                    type="submit"
                    className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                >
                    {transition.submission ? "Creating..." : "Create Post"}
                </button>
            </p>
        </Form>
    );
}
