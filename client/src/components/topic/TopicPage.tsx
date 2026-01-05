import { useParams, Outlet, useNavigate } from "react-router";
import { useFetch } from "../../hooks/useFetch";
import type { Post } from "../../types";
import { formatDate, isValidTopic } from "../../utils";
import NotFound from "../NotFound";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function TopicPage() {
   const { topic } = useParams();

   const nav = useNavigate();

   const { data: posts, isError, isLoading } = useFetch<Post[]>([`topic-${topic}`], `/posts/${topic}`, {
      enabled: isValidTopic(topic),
   });

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
                           <p>#{post.id}</p>
                           <h2 className="text-2xl">{post.title}</h2>
                           <p>{post.description}</p>
                           <p className="text-sm text-gray-500">Posted by {post.postedBy.username} on {formatDate(post.postedOn)}</p>
                           <p className="text-sm text-gray-500">{post.commentCount} comments | {post.voteScore} votes | Your vote: {post.userVote ?? "Not logged in"}</p>
                        </CardContent>
                     </Card>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
