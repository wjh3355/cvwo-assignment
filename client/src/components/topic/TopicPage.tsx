import { Outlet, useParams } from "react-router";

export default function TopicPage() {
   const { topic } = useParams();
   return (
      <div>
         <h1>Topic: {topic}</h1>
         <Outlet />
      </div>
   );
}
