import { useParams } from "react-router"
import NotFound from "../NotFound"
import { formatDate, isValidTopic } from "../../utils"
import { useFetch } from "../../hooks/useFetch"
import type { Post, Comment } from "../../types"
import GenericVoteDisplay from "../voting/GenericVoteDisplay"
import useUser from "../../hooks/useUser"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import MakeNew from "../new/MakeNewComment"

export default function PostPage() {
   const { topic, postId } = useParams()

   const validTopic = isValidTopic(topic)

   const {
      data: posts,
      isLoading: postsLoading,
      isError: postsError,
   } = useFetch<Post[]>(["posts", topic!], `/posts/${topic}`, {
      enabled: validTopic,
   })

   const { isError: useUserError } = useUser()

   const {
      data: comments,
      isLoading: commentsLoading,
      isError: commentsError,
   } = useFetch<Comment[]>(["comments", postId!], `/comments/${postId}`, {
      enabled: validTopic && !!postId,
   })

   if (!validTopic) return <NotFound />

   if (postsLoading) return <div>Loading...</div>
   if (postsError || !posts) return <div>Error loading post.</div>

   const post = posts.find((p) => p.id == Number(postId))
   if (!post) return <NotFound />

   if (commentsLoading) return <div>Loading comments...</div>
   if (commentsError || !comments) return <div>Error loading comments.</div>

   return (
      <div>
         <Card sx={{ mb: 3 }}>
            <CardHeader
               title={
                  <Typography variant="h4">
                     #{post.id} | {post.title}
                  </Typography>
               }
               subheader={
                  <Typography variant="body2" color="textSecondary">
                     <strong>{post.postedBy.username}</strong> |{" "}
                     {formatDate(post.postedOn)}
                  </Typography>
               }
            />
            <CardContent>
               <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
                  {post.description}
               </Typography>
               <GenericVoteDisplay
                  thing={post}
                  isUserAuthenticated={!useUserError}
                  topic={topic}
                  forWhat="post"
               />
            </CardContent>
         </Card>

         {comments.length === 0 ? (
            <Typography>No comments yet.</Typography>
         ) : (
            <ul>
               {comments.map((comment) => (
                  <li key={comment.id} className="my-3">
                     <p>
                        #{comment.id} | {comment.content}
                     </p>
                     <p className="text-sm text-gray-500">
                        <strong>{comment.commentedBy.username}</strong> |{" "}
                        {formatDate(comment.commentedOn)}
                     </p>
                     <GenericVoteDisplay
                        thing={comment}
                        isUserAuthenticated={!useUserError}
                        postId={postId}
                        forWhat="comment"
                     />
                  </li>
               ))}
            </ul>
         )}

         <MakeNew postId={post.id} />
      </div>
   )
}
