import { useParams } from "react-router";

export default function PostPage() {
   const { topic, postId } = useParams();
   return <div>Post {postId} in topic {topic}</div>;
}