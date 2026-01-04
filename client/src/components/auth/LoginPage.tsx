import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { LoginFields } from "../../types";
import { loginHandler } from "./logInOutHandlers";

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
            <input
               {...register("username")}
               onBlur={() => trigger("username")}
               autoFocus={true}
            />
            <span>{errors.username?.message}</span>
         </fieldset>

         <fieldset>
            <legend>Password</legend>
            <input
               {...register("password")}
               type="password"
               onBlur={() => trigger("password")}
            />
            <span>{errors.password?.message}</span>
         </fieldset>

         <div>
            <button
               type="submit"
               disabled={!isDirty || !isValid || isSubmitting}
            >
               {isSubmitting 
                  ?  <span/>
                  :  "Log In"
               }
            </button>
         </div>

      </form>
   );
};
