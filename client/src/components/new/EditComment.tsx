import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import { z } from "zod"
import Button from "@mui/material/Button"
import { useQueryClient } from "@tanstack/react-query"
import { api } from "../../config"
import TextField from "@mui/material/TextField"
import toast from "react-hot-toast"
import type { Comment } from "../../types"

interface EditCommentForm {
   newContent: string
}

interface EditCommentData extends EditCommentForm {
   commentId: number
}

export default function EditComment({
   postId,
   comment,
   cb,
}: {
   postId: string
   comment: Comment
   cb: () => void
}) {
   const {
      register,
      handleSubmit,
      formState: { errors, isValid, isSubmitting },
      trigger,
   } = useForm<EditCommentForm>({
      resolver: zodResolver(
         z.object({
            newContent: z.string().nonempty({ message: "Content is required" }),
         })
      ),
      defaultValues: { newContent: comment.content },
   })

   const qc = useQueryClient()

   const queryKey = ["comments", postId]

   async function handleCreateComment(data: EditCommentForm) {
      const patchReq: EditCommentData = {
         ...data,
         commentId: comment.id,
      }

      try {
         await api.patch("/comments", patchReq)

         qc.invalidateQueries({ queryKey })

         cb()

         toast.success("Comment edited successfully")
      } catch (error) {
         toast.error("Failed to edit comment. Please try again.")
         console.log(error)
      }
   }

   return (
      <div className="flex flex-col gap-4">
         <TextField
            {...register("newContent")}
            onBlur={() => trigger("newContent")}
            multiline
            rows={4}
            error={!!errors.newContent}
            helperText={errors.newContent?.message}
            label="Content"
         />
         <Button
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit(handleCreateComment)}
         >
            {isSubmitting ? "Submitting..." : "Edit Comment"}
         </Button>
      </div>
   )
}
