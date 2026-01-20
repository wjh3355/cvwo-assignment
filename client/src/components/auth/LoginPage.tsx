import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { useQueryClient } from "@tanstack/react-query"
import type { LoginFields } from "../../types"
import { loginHandler } from "./handlers"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

export default function Login() {
   const nav = useNavigate()

   // form handler
   const {
      register,
      handleSubmit,
      formState: { errors, isValid, isDirty, isSubmitting },
      trigger,
      reset,
   } = useForm<LoginFields>({
      resolver: zodResolver(
         z.object({
            username: z.string().nonempty({ message: "Username is required" }),
            password: z.string().nonempty({ message: "Password is required" }),
         })
      ),
      defaultValues: { username: "", password: "" },
   })

   const qc = useQueryClient()

   return (
      <form
         onSubmit={handleSubmit((data) => loginHandler(data, qc, nav, reset))}
         className="flex flex-col gap-4"
      >
         <title>Login</title>

         <TextField
            label="Username"
            error={!!errors.username}
            helperText={errors.username?.message}
            {...register("username")}
            onBlur={() => trigger("username")}
            autoFocus={true}
            variant="standard"
         />

         <TextField
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password")}
            type="password"
            onBlur={() => trigger("password")}
            variant="standard"
         />

         <div>
            <Button
               type="submit"
               disabled={!isDirty || !isValid || isSubmitting}
            >
               {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
            <Button type="button" onClick={() => nav("/auth/register")}>
               No account? REGISTER here.
            </Button>
         </div>
      </form>
   )
}
