import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import type { Comment, Post, Topic, VoteType } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config";
import toast from "react-hot-toast";

interface VoteDisplayProps<T extends Post | Comment> {
   thing: T;
   isUserAuthenticated: boolean;
   topic?: Topic;
   postId?: string;
   forWhat: "post" | "comment";
}

export default function GenericVoteDisplay<T extends Post | Comment>({ thing, isUserAuthenticated, topic, postId, forWhat }: VoteDisplayProps<T>) {

   const { userVote, voteScore, id } = thing

   const queryKey = forWhat === "post" ? ["posts", topic] : ["comments", postId];

   const qc = useQueryClient()

   const mut = useMutation({
      mutationFn: (voteType: VoteType) => api.post("/vote", { postOrCommentId: id, voteType, postOrComment: forWhat }),
      onMutate: async (newVote: VoteType) => {
         await qc.cancelQueries({ queryKey })
         const prevData = qc.getQueryData<T[]>(queryKey)
         qc.setQueryData<T[]>(queryKey, (oldData) => {
            if (!oldData) return [];
            return oldData.map((porc) => porc.id !== id
               ? porc
               : {
                  ...porc,
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