import { useForm } from "react-hook-form"
import type { Post, Topic } from "../../types"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import { z } from "zod"
import Button from "@mui/material/Button"
import { useQueryClient } from "@tanstack/react-query"
import { api } from "../../config"
import TextField from "@mui/material/TextField"
import toast from "react-hot-toast"

interface EditPostForm {
   newTitle: string
   newDescription: string
}

interface EditPostData extends EditPostForm {
   postId: number
}

export default function EditPost({
   post,
   topic,
   cb,
}: {
   post: Post
   topic: Topic
   cb: () => void
}) {
   const {
      register,
      handleSubmit,
      formState: { errors, isValid, isSubmitting },
      trigger,
   } = useForm<EditPostForm>({
      resolver: zodResolver(
         z.object({
            newTitle: z.string().nonempty({ message: "Title is required" }),
            newDescription: z
               .string()
               .nonempty({ message: "Description is required" }),
         })
      ),
      defaultValues: { newDescription: post.description, newTitle: post.title },
   })

   const qc = useQueryClient()

   const queryKey = ["posts", topic]

   async function handleCreateComment(data: EditPostForm) {
      const patchReq: EditPostData = {
         ...data,
         postId: post.id,
      }

      try {
         await api.patch("/posts", patchReq)

         qc.invalidateQueries({ queryKey })

         cb()

         toast.success("Post edited successfully")
      } catch (error) {
         toast.error("Failed to edit post. Please try again.")
         console.log(error)
      }
   }

   return (
      <div className="flex flex-col gap-4">
         <TextField
            label="Title"
            error={!!errors.newTitle}
            helperText={errors.newTitle?.message}
            {...register("newTitle")}
            onBlur={() => trigger("newTitle")}
            variant="standard"
         />
         <TextField
            label="Description"
            error={!!errors.newDescription}
            helperText={errors.newDescription?.message}
            {...register("newDescription")}
            onBlur={() => trigger("newDescription")}
            multiline
            rows={4}
         />
         <Button
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit(handleCreateComment)}
         >
            {isSubmitting ? "Submitting..." : "Edit Post"}
         </Button>
      </div>
   )
}
