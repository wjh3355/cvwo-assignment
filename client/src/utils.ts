import { TOPICS } from "./config"
import type { Topic } from "./types"

export function capitalise(str: string): string {
   if (str.length === 0) return str
   return str.charAt(0).toUpperCase() + str.slice(1)
}

export function isValidTopic(t: string | undefined): t is Topic {
   return t !== undefined && TOPICS.includes(t as Topic)
}

export function formatDate(date: string): string {
   const d = new Date(date)

   const day = String(d.getDate()).padStart(2, "0")
   const month = String(d.getMonth() + 1).padStart(2, "0")
   const year = d.getFullYear()

   const hours = String(d.getHours()).padStart(2, "0")
   const minutes = String(d.getMinutes()).padStart(2, "0")

   return `${day}/${month}/${year} at ${hours}:${minutes}`
}
