import type { LoaderFunction } from "remix";
import { Form, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { getPost } from "~/post";

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};

export default function EditPost() {
  let post = useLoaderData();

  return (
    <div>
      <h2>Edit post</h2>
      <Form method="post">
        <p>
          <label htmlFor="title">
            Post Title:
            <input type="text" name="title" value={post.title}></input>
          </label>
        </p>
        <p>
          <label htmlFor="markdown">Post body:</label>
          <br />
          <textarea rows={20} name="markdown" defaultValue={post.html} />
        </p>
        <p>
          <button type="submit">Edit Post</button>
        </p>
      </Form>
    </div>
  );
}
