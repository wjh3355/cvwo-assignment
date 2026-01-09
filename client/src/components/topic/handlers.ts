import toast from "react-hot-toast"
import { api } from "../../config"
import type { QueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"

export async function handleDeletePost(
   postId: number,
   qc: QueryClient,
   queryKey: string[]
) {
   try {
      await api.delete("/posts", { data: { postId } })

      qc.invalidateQueries({ queryKey })

      toast.success("Post deleted successfully")
   } catch (error) {
      if (isAxiosError(error)) {
         if (error.response) {
            toast.error(`Logout failed: ${error.response.data.error}.`)
         } else {
            toast.error(`Logout failed: ${error.request}.`)
         }
      } else {
         toast.error("An unknown error occured. Try again later.")
      }
   }
}
