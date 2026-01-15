import { Link, useParams } from "react-router"
import NotFound from "../NotFound"
import { capitalise, formatDate, isValidTopic } from "../../utils"
import { useFetch } from "../../hooks/useFetch"
import type { Post, Comment } from "../../types"
import GenericVoteDisplay from "../voting/GenericVoteDisplay"
import useUser from "../../hooks/useUser"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import MakeNewComment from "../new/MakeNewComment"
import PostPageComment from "./PostPageComment"
import GenericLoading from "../GenericLoading"
import ErrorPage from "../ErrorPage"
import Alert from "@mui/material/Alert"
import Breadcrumbs from "@mui/material/Breadcrumbs"

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

   const { isError: useUserError, data: currUser } = useUser()

   const {
      data: comments,
      isLoading: commentsLoading,
      isError: commentsError,
   } = useFetch<Comment[]>(["comments", postId!], `/comments/${postId}`, {
      enabled: validTopic && !!postId,
   })

   if (!validTopic) return <NotFound />

   if (postsLoading) return <GenericLoading />
   if (postsError || !posts) return <ErrorPage str="Error loading post." />

   const post = posts.find((p) => p.id == Number(postId))
   if (!post) return <NotFound />

   if (commentsLoading) return <GenericLoading />
   if (commentsError || !comments)
      return <ErrorPage str="Error loading comments." />

   return (
      <div className="w-full max-w-6xl flex flex-col gap-4">
         <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/">
               Home
            </Link>
            <Link color="inherit" to={`/${topic}`}>
               {capitalise(topic)}
            </Link>
            <Typography>Post #{post.id}</Typography>
         </Breadcrumbs>

         <Typography variant="h4" gutterBottom>
            Topic: {topic}
         </Typography>

         <Card sx={{ mb: 3 }}>
            <CardHeader
               title={
                  <Typography variant="h5">
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
               <Typography sx={{ mb: 2 }}>{post.description}</Typography>
               <GenericVoteDisplay
                  thing={post}
                  isUserAuthenticated={!useUserError}
                  topic={topic}
                  forWhat="post"
                  isADeletedPost={post.postedBy.id === -999}
               />
            </CardContent>
         </Card>

         {useUserError && (
            <Alert severity="warning">
               Please{" "}
               <Link to="/auth" className="underline text-blue-600">
                  log in
               </Link>{" "}
               to vote on posts and comments.
            </Alert>
         )}

         {comments.length === 0 ? (
            <Alert severity="info">No comments yet.</Alert>
         ) : (
            <ul>
               {comments.map((comment) => (
                  <PostPageComment
                     comment={comment}
                     postId={postId!}
                     currUser={currUser}
                     useUserError={useUserError}
                  />
               ))}
            </ul>
         )}

         <MakeNewComment postId={post.id} user={currUser} />
      </div>
   )
}
