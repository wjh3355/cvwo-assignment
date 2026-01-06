import { useForm } from "react-hook-form"
import type { Topic } from "../../types"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import { z } from "zod"
import Button from "@mui/material/Button"
import { useQueryClient } from "@tanstack/react-query"
import { api } from "../../config"
import TextField from "@mui/material/TextField"
import toast from "react-hot-toast"

interface NewPostForm {
   title: string
   description: string
}

interface NewPostData extends NewPostForm {
   topic: Topic
}
export default function MakeNewComment({ topic }: { topic: Topic }) {
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

         toast.success("Comment created successfully")
      } catch (error) {
         toast.error("Failed to create comment. Please try again.")
         console.log(error)
      }
   }

   return (
      <div>
         <TextField
            {...register("description")}
            onBlur={() => trigger("description")}
            label="Comment"
            multiline
            rows={4}
         />
         <p>{errors.description?.message}</p>
         <Button
            disabled={!isDirty || !isValid || isSubmitting}
            onClick={handleSubmit(handleCreateComment)}
         >
            {isSubmitting ? "Submitting..." : "Submit Comment"}
         </Button>
      </div>
   )
}
