import { useForm } from "react-hook-form"
import type { User } from "../../types"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import { z } from "zod"
import Button from "@mui/material/Button"
import { useQueryClient } from "@tanstack/react-query"
import { api } from "../../config"
import TextField from "@mui/material/TextField"
import toast from "react-hot-toast"
import Typography from "@mui/material/Typography"
import Alert from "@mui/material/Alert"
import { Link } from "react-router"
import Card from "@mui/material/Card"

interface NewTopicForm {
   name: string
}

export default function MakeNewTopic({ user }: { user: User | undefined }) {
   const {
      register,
      handleSubmit,
      formState: { errors, isValid, isDirty, isSubmitting },
      trigger,
      reset,
   } = useForm<NewTopicForm>({
      resolver: zodResolver(
         z.object({
            name: z
               .string()
               .nonempty({ message: "Topic name is required" })
               .max(20, { message: "Topic name must be at most 20 characters" })
               .min(5, { message: "Topic name must be at least 5 characters" })
               .refine((name) => !/\s/.test(name), {
                  message: "Topic name must not contain spaces",
               }),
         })
      ),
      defaultValues: { name: "" },
   })

   const qc = useQueryClient()

   if (!user) {
      return (
         <Alert severity="warning">
            Please{" "}
            <Link to="/auth" className="underline text-blue-600">
               log in
            </Link>{" "}
            to create a topic.
         </Alert>
      )
   }

   const queryKey = ["topics"]

   async function handleCreateTopic(data: NewTopicForm) {
      const postReq: NewTopicForm = {
         name: data.name.trim().toLowerCase(),
      }

      try {
         await api.post("/topics", postReq)

         qc.invalidateQueries({ queryKey })

         reset()

         toast.success("Topic created successfully")
      } catch (error) {
         toast.error("Failed to create topic. Please try again.")
         console.log(error)
      }
   }

   return (
      <Card sx={{ padding: 2, width: "100%" }}>
         <div className="w-full flex flex-col gap-4">
            <Typography variant="h5">Make new topic:</Typography>
            <div>
               <TextField
                  label="Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  className="w-full max-w-xl"
                  {...register("name")}
                  onBlur={() => trigger("name")}
                  variant="standard"
               />
            </div>
            <Button
               disabled={!isDirty || !isValid || isSubmitting}
               onClick={handleSubmit(handleCreateTopic)}
            >
               {isSubmitting ? "Submitting..." : "Create New Topic"}
            </Button>
         </div>
      </Card>
   )
}
