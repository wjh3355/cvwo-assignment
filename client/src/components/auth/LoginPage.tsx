import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router"
import { useQueryClient } from "@tanstack/react-query"
import type { LoginFields } from "../../types"
import { loginHandler } from "./handlers"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"

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
      <Box
         sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
         }}
      >
         <Card
            sx={{
               padding: 2,
            }}
         >
            <CardContent>
               <Typography variant="h5" gutterBottom>
                  Login
               </Typography>
               <form
                  onSubmit={handleSubmit((data) =>
                     loginHandler(data, qc, nav, reset)
                  )}
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
                     <Button
                        type="button"
                        onClick={() => nav("/auth/register")}
                     >
                        No account? REGISTER here.
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </Box>
   )
}
