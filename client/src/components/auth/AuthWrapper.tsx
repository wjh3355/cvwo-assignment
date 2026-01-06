import { Navigate, Outlet } from "react-router"
import GenericLoading from "../GenericLoading"
import useUser from "../../hooks/useUser"

export default function AuthRoutesWrapper() {
   const { isLoading, isError } = useUser()

   return isLoading ? (
      <GenericLoading str="Loading authentication..." />
   ) : isError ? (
      <Outlet />
   ) : (
      <Navigate to="/" replace />
   )
}
