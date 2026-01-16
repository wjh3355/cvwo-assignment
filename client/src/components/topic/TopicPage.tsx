import { useParams, useNavigate, Link } from "react-router"
import { useFetch } from "../../hooks/useFetch"
import type { Post } from "../../types"
import { capitalise } from "../../utils"
import NotFound from "../NotFound"
import useUser from "../../hooks/useUser"
import MakeNewPost from "../new/MakeNewPost"
import TopicPostElement from "./TopicPostElement"
import GenericLoading from "../GenericLoading"
import ErrorPage from "../ErrorPage"
import Typography from "@mui/material/Typography"
import Alert from "@mui/material/Alert"
import Breadcrumbs from "@mui/material/Breadcrumbs"

export default function TopicPage() {
   const { topic } = useParams()

   const nav = useNavigate()

   const {
      data: posts,
      isError,
      isLoading,
   } = useFetch<Post[]>(["posts", topic!], `/posts/${topic}`, {
      enabled: !!topic,
   })

   const { isError: useUserError, data: thisUser } = useUser()

   if (!topic) {
      return <NotFound />
   }

   return (
      <div className="w-full max-w-6xl gap-4 flex flex-col ">
         <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/">
               Home
            </Link>
            <Typography>{capitalise(topic)}</Typography>
         </Breadcrumbs>

         <Typography variant="h4" gutterBottom>
            Topic: {topic}
         </Typography>
         {isLoading && <GenericLoading />}
         {isError && <ErrorPage str="Error loading posts." />}
         {posts && posts.length === 0 && (
            <Alert severity="info">No posts available.</Alert>
         )}
         {posts && posts.length > 0 && (
            <>
               {useUserError && (
                  <Alert severity="warning">
                     Please{" "}
                     <Link to="/auth" className="underline text-blue-600">
                        log in
                     </Link>{" "}
                     to vote on posts.
                  </Alert>
               )}
               <ul>
                  {posts.map((post) => (
                     <TopicPostElement
                        key={post.id}
                        post={post}
                        topic={topic}
                        nav={nav}
                        currUser={thisUser}
                        useUserError={useUserError}
                     />
                  ))}
               </ul>
            </>
         )}
         <MakeNewPost topic={topic} user={thisUser} />
      </div>
   )
}
