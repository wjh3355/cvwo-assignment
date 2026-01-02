import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError, type AxiosRequestConfig } from "axios";

export function useFetch<T>(key: string, url: string, options?: AxiosRequestConfig) {

   async function queryFn() {
      console.log(`Fetching data from ${url} (key: ${key})`)

      try {
         const response = await axios.get<T>(url, options);
         
         console.log(response.data)

         return response.data;

      } catch (error) {
         if (isAxiosError(error)) {
            console.error(`Error fetching data from ${url}:`, error.response?.data || error.message);
            throw new Error(`Error fetching data: ${error.response?.data || error.message}`);
         } else {
            console.error(`Unexpected error:`, error);
            throw new Error("Unexpected error occurred");
         }
      }
   }

   return useQuery<T, Error>({
      queryKey: [key],
      queryFn,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: false,
   });
}