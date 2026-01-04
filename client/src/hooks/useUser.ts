import { useFetch } from "./useFetch";
import type { User } from "../types";

export default function useUser() {
   return useFetch<User>(
      ["current-user"],
      "/check-auth",
   );
}