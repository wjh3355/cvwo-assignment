import { Navigate, Outlet } from "react-router";
import { useFetch } from "../../hooks/useFetch";
import GenericLoading from "../GenericLoading";
import { type User } from "../../types";

export default function AuthRoutesWrapper() {

   const { isLoading, isError } = useFetch<User>("user", "/api/user", { withCredentials: true });

   return isLoading
      ? <GenericLoading str="Loading authentication..."/>
      : isError
         ? <Navigate to="/auth" replace/>
         : <Outlet/>;
}