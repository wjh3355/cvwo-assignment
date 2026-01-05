import { Stack, IconButton, Typography } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import type { Comment, Post, Topic, VoteType } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config";
import toast from "react-hot-toast";
   
interface CommentVoteDisplayProps {
   comment: Comment;
   isUserAuthenticated: boolean;
   postId: string;
}

export default function CommentVoteDisplay({ comment, isUserAuthenticated, postId }: CommentVoteDisplayProps) {

   const { userVote, voteScore, id: commentId } = comment

   const queryKey = ["comments", postId];

   console.log(queryKey)
   // console.log(commentId)

   const qc = useQueryClient()

   const mut = useMutation({
      mutationFn: (voteType: VoteType) => api.post("/comments/vote", { commentId, voteType }),
      onMutate: async (newVote: VoteType) => {
         await qc.cancelQueries({ queryKey })
         const prevData = qc.getQueryData<Comment[]>(queryKey)
         qc.setQueryData<Comment[]>(queryKey, (oldData) => {
            if (!oldData) return [];
            return oldData.map((c) => c.id !== commentId
                  ? c
                  : {
                     ...c,
                     userVote: newVote,
                     voteScore: voteScore + newVote - userVote!,
                    }
            );
         });

         return { prevData };
      },
      onError: (_1, _2, context) => {
         if (context?.prevData) {
            qc.setQueryData(queryKey, context.prevData);
         }
         toast.error("Failed to register vote. Please try again.");
      },
      onSettled: () => qc.invalidateQueries({ queryKey })
   })

   function handleVote(type: VoteType) {
      if (!isUserAuthenticated) return toast.error("Please login to vote");
      mut.mutate(type);
   };

   return (
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: 40 }}>
         <IconButton
            size="small"
            onClick={() => userVote === 1 ? handleVote(0) : handleVote(1)}
            disabled={!isUserAuthenticated || mut.isPending}
            sx={{
               color: userVote === 1 ? "orange" : "inherit",
               "&:hover": { color: "orange" }
            }}
         >
            <ArrowUpwardRoundedIcon fontSize="medium" />
         </IconButton>

         <Typography
            variant="body2"
            fontWeight="bold"
            sx={{
               color: userVote === 1 ? "orange" : userVote === -1 ? "blue" : "inherit"
            }}
         >
            {voteScore}
         </Typography>

         <IconButton
            size="small"
            onClick={() => userVote === -1 ? handleVote(0) : handleVote(-1)}
            disabled={!isUserAuthenticated || mut.isPending}
            sx={{
               color: userVote === -1 ? "blue" : "inherit",
               "&:hover": { color: "blue" }
            }}
         >
            <ArrowDownwardRoundedIcon fontSize="medium" />
         </IconButton>
      </Stack>
   );
}