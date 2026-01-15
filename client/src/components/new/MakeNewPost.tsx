import { useForm } from "react-hook-form"
import type { Topic, User } from "../../types"
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

interface NewPostForm {
   title: string
   description: string
}

interface NewPostData extends NewPostForm {
   topic: Topic
}
export default function MakeNewPost({
   topic,
   user,
}: {
   topic: Topic
   user: User | undefined
}) {
   const {
      register,
      handleSubmit,
      formState: { errors, isValid, isDirty, isSubmitting },
      trigger,
      reset,
   } = useForm<NewPostForm>({
      resolver: zodResolver(
         z.object({
            title: z.string().nonempty({ message: "Title is required" }),
            description: z
               .string()
               .nonempty({ message: "Description is required" }),
         })
      ),
      defaultValues: { description: "", title: "" },
   })

   const qc = useQueryClient()

   if (!user) {
      return (
         <Alert severity="warning">
            Please{" "}
            <Link to="/auth" className="underline text-blue-600">
               log in
            </Link>{" "}
            to create a post.
         </Alert>
      )
   }

   const queryKey = ["posts", topic]

   async function handleCreateComment(data: NewPostForm) {
      const postReq: NewPostData = {
         ...data,
         topic,
      }

      try {
         await api.post("/posts", postReq)

         qc.invalidateQueries({ queryKey })

         reset()

         toast.success("Post created successfully")
      } catch (error) {
         toast.error("Failed to create post. Please try again.")
         console.log(error)
      }
   }

   return (
      <div className="w-full flex flex-col gap-4">
         <Typography variant="h5">Make new post for this topic:</Typography>
         <div>
            <TextField
               label="Title"
               error={!!errors.title}
               helperText={errors.title?.message}
               className="w-full max-w-xl"
               {...register("title")}
               onBlur={() => trigger("title")}
               variant="standard"
            />
         </div>
         <div>
            <TextField
               label="Description"
               error={!!errors.description}
               helperText={errors.description?.message}
               className="w-full max-w-xl"
               {...register("description")}
               onBlur={() => trigger("description")}
               multiline
               rows={4}
            />
         </div>
         <Button
            disabled={!isDirty || !isValid || isSubmitting}
            onClick={handleSubmit(handleCreateComment)}
         >
            {isSubmitting ? "Submitting..." : "Submit Post"}
         </Button>
      </div>
   )
}
