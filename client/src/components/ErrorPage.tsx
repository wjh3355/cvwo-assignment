import { useNavigate } from "react-router"

export default function ErrorPage() {
   const nav = useNavigate()

   return (
      <div>
         <p>Oops! Something went wrong.</p>
         <button onClick={() => window.location.reload()}>Reload</button>
         <button onClick={() => nav("/")}>Go Home</button>
      </div>
   )
}
