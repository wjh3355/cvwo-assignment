import Button from "@mui/material/Button"
import { useNavigate } from "react-router"

export default function ErrorPage({ str }: { str?: string }) {
   const nav = useNavigate()

   return (
      <div>
         <p>{str ?? "Oops! Something went wrong."}</p>
         <Button onClick={() => window.location.reload()}>Reload</Button>
         <Button onClick={() => nav("/")}>Go Home</Button>
      </div>
   )
}
