import axios, { isAxiosError } from "axios"
import type { QueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const TOPICS: readonly string[] = [
   "technology",
   "health",
   "science",
   "art",
   "history",
   "sports",
   "music",
   "travel",
   "food",
   "education",
   "finance",
   "environment",
   "politics",
   "culture",
   "literature",
   "photography",
] as const

if (!import.meta.env.VITE_API_URL) {
   throw new Error("VITE_API_URL is not defined")
} else {
   console.log("Backend URL:", import.meta.env.VITE_API_URL)
}

export const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL + "/api",
   withCredentials: true,
   headers: {
      "Content-Type": "application/json",
   },
})

export async function genericHTTPRequestHandler(
   url: string,
   method: string,
   data: any,
   queryKey: string[],
   qc: QueryClient,
   operation: string = "Operation"
) {
   try {
      await api({ url, method, data })

      qc.invalidateQueries({ queryKey })

      toast.success(`${operation} successful`)
   } catch (error) {
      if (isAxiosError(error)) {
         if (error.response) {
            toast.error(`${operation} failed: ${error.response.data.error}.`)
         } else {
            toast.error(`${operation} failed: ${error.request}.`)
         }
      } else {
         toast.error("An unknown error occured. Try again later.")
      }
   }
}
