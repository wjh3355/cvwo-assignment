import { useParams, Outlet, useNavigate } from "react-router";
import { useFetch } from "../../hooks/useFetch";
import type { Post } from "../../types";
import { formatDate, isValidTopic } from "../../utils";
import NotFound from "../NotFound";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PostVoteDisplay from "../voting/PostVoteDisplay";
import { Box, Typography } from "@mui/material";
import useUser from "../../hooks/useUser";

export default function TopicPage() {
   const { topic } = useParams();

   const nav = useNavigate();

   const { data: posts, isError, isLoading } = useFetch<Post[]>(["posts", topic!], `/posts/${topic}`, {
      enabled: isValidTopic(topic),
   });

   const { isError: useUserError } = useUser()

   if (!isValidTopic(topic)) {
      return <NotFound />;
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
                  <li
                     key={post.id}
                     className="hover:cursor-pointer"
                     onClick={() => nav(`/${topic}/${post.id}`)}
                  >
                     <Card>
                        <CardContent>
                           <Box>
                              <Typography variant="caption" color="text.secondary">
                                 #{post.id} | Posted by <strong>{post.postedBy.username}</strong> | {formatDate(post.postedOn)} | {post.commentCount} comments
                              </Typography>
                           </Box>
                           <Typography variant="h5">
                              {post.title}
                           </Typography>
                           <Typography variant="body2" color="text.secondary" noWrap>
                              {post.description}
                           </Typography>
                           <div onClick={e => e.stopPropagation()}>
                              <PostVoteDisplay post={post} isUserAuthenticated={!useUserError} topic={topic} />
                           </div>
                        </CardContent>
                     </Card>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
