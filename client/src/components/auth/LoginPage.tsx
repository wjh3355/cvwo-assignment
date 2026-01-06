import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { LoginFields } from "../../types";
import { loginHandler } from "./handlers";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function Login() {

   const nav = useNavigate();

   // form handler
   const {
      register,
      handleSubmit,
      formState: { errors, isValid, isDirty, isSubmitting },
      trigger,
      reset
   } = useForm<LoginFields>({
      resolver: zodResolver(
         z.object({
            username: z.string().nonempty({ message: "Username is required" }),
            password: z.string().nonempty({ message: "Password is required" }),
         })
      ),
      defaultValues: { username: "", password: "" },
   });

   const qc = useQueryClient();

   return (
      <form onSubmit={handleSubmit((data) => loginHandler(data, qc, nav, reset))}>
         <title>Login</title>

         <fieldset>
            <legend>Username</legend>
            <TextField
               {...register("username")}
               onBlur={() => trigger("username")}
               autoFocus={true}
               variant="standard"
               />
            <span>{errors.username?.message}</span>
         </fieldset>

         <fieldset>
            <legend>Password</legend>
            <TextField
               {...register("password")}
               type="password"
               onBlur={() => trigger("password")}
               variant="standard"
            />
            <span>{errors.password?.message}</span>
         </fieldset>

         <div>
            <Button
               type="submit"
               disabled={!isDirty || !isValid || isSubmitting}
            >
               {isSubmitting
                  ? "Logging in..."
                  : "Log In"
               }
            </Button>
            <Button
               type="button"
               onClick={() => nav("/auth/register")}
            >
               No account? Regsiter here.
            </Button>
         </div>

      </form>
   );
};
