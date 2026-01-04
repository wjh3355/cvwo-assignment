import { useParams, Outlet } from "react-router";
import { useFetch } from "../../hooks/useFetch";
import type { Post } from "../../types";
import { isValidTopic } from "../../utils";
import NotFound from "../NotFound";

export default function TopicPage() {
   const { topic } = useParams();

   // const nav = useNavigate();

   const { data: posts, isError, isLoading } = useFetch<Post[]>([`topic-${topic}`], `/topics/${topic}`, {
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
                  <li key={post.id}>
                     <h2>{post.title}</h2>
                     <p>{post.description}</p>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
