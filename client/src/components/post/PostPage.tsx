import { useParams } from "react-router";
import NotFound from "../NotFound";
import { isValidTopic } from "../../utils";
import { useFetch } from "../../hooks/useFetch";
import type { Post, Comment } from "../../types";

export default function PostPage() {
   const { topic, postId } = useParams();

   const validTopic = isValidTopic(topic);

   const {
      data: posts,
      isLoading: postsLoading,
      isError: postsError,
   } = useFetch<Post[]>(
      ['posts', topic!],
      `/topics/${topic}`,
      { enabled: validTopic }
   );

   const {
      data: comments,
      isLoading: commentsLoading,
      isError: commentsError,
   } = useFetch<Comment[]>(
      ['comments', postId!],
      `/comments/${postId}`,
      { enabled: validTopic && !!postId }
   );

   if (!validTopic) return <NotFound />;

   if (postsLoading) return <div>Loading...</div>;
   if (postsError || !posts) return <div>Error loading post.</div>;

   const post = posts.find(p => p.id === postId);
   if (!post) return <NotFound />;

   if (commentsLoading) return <div>Loading comments...</div>;
   if (commentsError || !comments) return <div>Error loading comments.</div>;

   return (
      <div>
         <h1>{post.title}</h1>
         <p>{post.description}</p>

         <h2>Comments</h2>
         {comments.length === 0 ? (
            <p>No comments yet.</p>
         ) : (
            <ul>
               {comments.map(comment => (
                  <li key={comment.id}>
                     <p>{comment.content}</p>
                     <p>
                        By {comment.commentedBy.username} on{" "}
                        {new Date(comment.commentedOn).toLocaleString()}
                     </p>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}