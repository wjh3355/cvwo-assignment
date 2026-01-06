import { useForm } from "react-hook-form";
import type { Topic } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { z } from "zod";
import Button from "@mui/material/Button";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../config";
import TextField from "@mui/material/TextField";
import toast from "react-hot-toast";

interface NewPostForm {
   title: string;
   description: string;
}

interface NewPostData extends NewPostForm {
   topic: Topic;
}

interface NewCommentForm {
   content: string;
}

interface NewCommentData extends NewCommentForm {
   postId: number;
}

export default function MakeNewComment({ postId }: { postId: number }) {

   const {
      register,
      handleSubmit,
      formState: { errors, isValid, isDirty, isSubmitting },
      trigger,
      reset
   } = useForm<NewCommentForm>({
      resolver: zodResolver(
         z.object({
            content: z.string().nonempty({ message: "Content is required" }),
         })
      ),
      defaultValues: { content: "" },
   });

   const qc = useQueryClient();

   const queryKey = ["comments", String(postId)];

   async function handleCreateComment(data: NewCommentForm) {
      const postReq: NewCommentData = {
         ...data,
         postId
      };

      try {
         await api.post("/comments", postReq);

         qc.invalidateQueries({ queryKey });

         reset();

         toast.success("Comment created successfully");

      } catch (error) {
         toast.error("Failed to create comment. Please try again.");
         console.log(error)
      }
   }

   return (
      <div>
         <TextField
            {...register("content")}
            onBlur={() => trigger("content")}
            label="Comment"
            multiline
            rows={4}
         />
         <p>{errors.content?.message}</p>
         <Button
            disabled={!isDirty || !isValid || isSubmitting}
            onClick={handleSubmit(handleCreateComment)}
         >
            {isSubmitting ? "Submitting..." : "Submit Comment"}
         </Button>
      </div>
   )
}
