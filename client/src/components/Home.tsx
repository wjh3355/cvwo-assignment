import { useNavigate } from "react-router"
import { TOPICS } from "../consts";
import { capitalise } from "../utils";
import Button from "@mui/material/Button"

export default function Home() {

   const nav = useNavigate();

   return (
      <div>
         <h1>Welcome to the Home Page</h1>
         <ul>
            {TOPICS.map(topic => (
               <li key={topic}>
                  <Button 
                     onClick={() => nav(`/${topic}`)}
                     variant="contained"
                  >
                     {capitalise(topic)}
                  </Button>
               </li>
            ))}
         </ul>
      </div>
   )
}
