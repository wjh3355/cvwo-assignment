import { useParams, useNavigate } from "react-router"
import { useFetch } from "../../hooks/useFetch"
import type { Post } from "../../types"
import { isValidTopic } from "../../utils"
import NotFound from "../NotFound"
import useUser from "../../hooks/useUser"
import MakeNewPost from "../new/MakeNewPost"
import TopicPostElement from "./TopicPostElement"

export default function TopicPage() {
   const { topic } = useParams()

   const nav = useNavigate()

   const {
      data: posts,
      isError,
      isLoading,
   } = useFetch<Post[]>(["posts", topic!], `/posts/${topic}`, {
      enabled: isValidTopic(topic),
   })

   const { isError: useUserError, data: thisUser } = useUser()

   if (!isValidTopic(topic)) {
      return <NotFound />
   }

   return (
      <div>
         <h1>Topic: {topic}</h1>
         {isLoading && <div>Loading...</div>}
         {isError && <div>Error loading posts.</div>}
         {posts && posts.length === 0 && <div>No posts available.</div>}
         {posts && posts.length > 0 && (
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
         )}
         <MakeNewPost topic={topic} user={thisUser} />
      </div>
   )
}
