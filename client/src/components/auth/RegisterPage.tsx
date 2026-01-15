import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { useQueryClient } from "@tanstack/react-query"
import type { RegisterFields } from "../../types"
import { registerHandler } from "./handlers"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

export default function Register() {
   const nav = useNavigate()

   // form handler
   const {
      register,
      handleSubmit,
      formState: { errors, isValid, isDirty, isSubmitting },
      trigger,
      reset,
   } = useForm<RegisterFields>({
      resolver: zodResolver(
         z
            .object({
               username: z
                  .string()
                  .nonempty({ message: "Username is required" })
                  .refine((s) => !s.includes(" "), {
                     message: "Username cannot contain spaces",
                  })
                  .refine((s) => 3 <= s.length && s.length <= 50, {
                     message: "Username must be between 3 and 50 characters",
                  }),
               password: z
                  .string()
                  .nonempty({ message: "Password is required" }),
               confirmPassword: z
                  .string()
                  .nonempty({ message: "Please confirm your password" }),
            })
            .refine((d) => d.password === d.confirmPassword, {
               message: "Passwords do not match",
               path: ["confirmPassword"],
            })
      ),
      defaultValues: { username: "", password: "", confirmPassword: "" },
   })

   const qc = useQueryClient()

   return (
      <form
         onSubmit={handleSubmit((data) =>
            registerHandler(data, qc, nav, reset)
         )}
         className="flex flex-col gap-4"
      >
         <title>Login</title>

         <TextField
            label="Username"
            error={!!errors.username}
            helperText={errors.username?.message}
            variant="standard"
            {...register("username")}
            onBlur={() => trigger("username")}
            autoFocus={true}
         />

         <TextField
            label="Password"
            error={!!errors.password}
            helperText={errors.password?.message}
            variant="standard"
            {...register("password")}
            onBlur={() => trigger("password")}
         />

         <TextField
            label="Confirm Password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            variant="standard"
            {...register("confirmPassword")}
            onBlur={() => trigger("confirmPassword")}
         />

         <div>
            <Button
               type="submit"
               disabled={!isDirty || !isValid || isSubmitting}
            >
               {isSubmitting ? "Registering..." : "Register"}
            </Button>
            <Button type="button" onClick={() => nav("/auth")}>
               Have an account? Login here.
            </Button>
         </div>
      </form>
   )
}
