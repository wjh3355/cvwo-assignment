import type { QueryClient } from "@tanstack/react-query";
import { api } from "../../config";
import toast from "react-hot-toast";
import type { NavigateFunction } from "react-router";
import { isAxiosError } from "axios";
import type { LoginFields, User } from "../../types";
import type { UseFormReset } from "react-hook-form";

export async function logoutHandler(qc: QueryClient, nav: NavigateFunction) {

   try {

      await api.post("/logout");

      qc.clear()

      toast.success("Logout successful");

      nav("/");

   } catch (error) {
      
      if (isAxiosError(error)) {
         if (error.response) {
            toast.error(`Logout failed: ${error.response.data.error}.`);
         } else {
            toast.error(`Logout failed: ${error.request}.`);
         }
      } else {
         toast.error("An unknown error occured. Try again later.");
      }
   }
}

export async function loginHandler(data: LoginFields, qc: QueryClient, nav: NavigateFunction, reset: UseFormReset<LoginFields>) {

   const { username, password } = data;

   try {

      qc.clear()

      const res = await api.post<User>("/login", { username, password })

      const newLoggedInUser = res.data

      qc.setQueryData(['current-user'], newLoggedInUser);

      reset();

      toast.success(`Welcome, ${newLoggedInUser.username}`);

      nav("/");

   } catch (error) {
      
      console.log(`Log in for ${username} unsuccessful: \n${error}`);

      if (isAxiosError(error)) {
         if (error.response) {
            toast.error(`Login failed: ${error.response.data.error}.`);
         } else {
            toast.error(`Login failed: ${error.request}.`);
         }
      } else {
         toast.error("An unknown error occured. Try again later.");
      }
   }
}

// export async function registerHandler(data: LoginFields, qc: QueryClient, nav: NavigateFunction) {
//    // TODO
// }