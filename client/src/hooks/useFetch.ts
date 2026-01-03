import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import axios, { isAxiosError, type AxiosRequestConfig } from "axios";

export function useFetch<T>(key: string[], url: string, axiousConfig?: AxiosRequestConfig, queryOptions?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">): ReturnType<typeof useQuery<T, Error>> {

   async function queryFn() {
      console.log(`Fetching data from ${url} (key: ${key})`)

      try {
         const response = await axios.get<T>(url, axiousConfig);
         
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
      queryKey: key,
      queryFn,
      enabled: key.every(Boolean),
      staleTime: 5 * 60 * 1000,
      retry: false,
      ...queryOptions,
   });
}