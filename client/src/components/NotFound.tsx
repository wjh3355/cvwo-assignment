import { useNavigate } from "react-router"

export default function NotFound() {
   const nav = useNavigate()

   return (
      <div>
         <h1>404 - Not Found</h1>
         <p>The page you are looking for does not exist.</p>
         <button onClick={() => nav(-1)}>Go Back</button>
         <button onClick={() => nav("/")}>Go Home</button>
      </div>
   )
}
