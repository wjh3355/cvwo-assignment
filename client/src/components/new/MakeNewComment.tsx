import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js"
import { z } from "zod"
import Button from "@mui/material/Button"
import { useQueryClient } from "@tanstack/react-query"
import { api } from "../../config"
import TextField from "@mui/material/TextField"
import toast from "react-hot-toast"
import Alert from "@mui/material/Alert"
import { Link } from "react-router"

interface NewCommentForm {
   content: string
}

interface NewCommentData extends NewCommentForm {
   postId: number
}

export default function MakeNewComment({
   postId,
   user,
}: {
   postId: number
   user: any
}) {
   const {
      register,
      handleSubmit,
      formState: { errors, isValid, isDirty, isSubmitting },
      trigger,
      reset,
   } = useForm<NewCommentForm>({
      resolver: zodResolver(
         z.object({
            content: z.string().nonempty({ message: "Content is required" }),
         })
      ),
      defaultValues: { content: "" },
   })

   const qc = useQueryClient()

   if (!user) {
      return (
         <Alert severity="warning">
            Please{" "}
            <Link to="/auth" className="underline text-blue-600">
               log in
            </Link>{" "}
            to create a comment.
         </Alert>
      )
   }

   const queryKey = ["comments", String(postId)]

   async function handleCreateComment(data: NewCommentForm) {
      const postReq: NewCommentData = {
         ...data,
         postId,
      }

      try {
         await api.post("/comments", postReq)

         qc.invalidateQueries({ queryKey })

         reset()

         toast.success("Comment created successfully")
      } catch (error) {
         toast.error("Failed to create comment. Please try again.")
         console.log(error)
      }
   }

   return (
      <div className="w-full flex flex-col gap-4">
         <TextField
            error={!!errors.content}
            helperText={errors.content?.message}
            {...register("content")}
            onBlur={() => trigger("content")}
            className="w-full max-w-xl"
            label="Comment"
            multiline
            rows={4}
         />
         <Button
            disabled={!isDirty || !isValid || isSubmitting}
            onClick={handleSubmit(handleCreateComment)}
         >
            {isSubmitting ? "Submitting..." : "Submit Comment"}
         </Button>
      </div>
   )
}
