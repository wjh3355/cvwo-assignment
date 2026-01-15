import { useState, type MouseEvent } from "react"
import type { Comment, User } from "../../types"
import { formatDate } from "../../utils"
import GenericVoteDisplay from "../voting/GenericVoteDisplay"
import { useQueryClient } from "@tanstack/react-query"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import MenuItem from "@mui/material/MenuItem"
import Dialog from "@mui/material/Dialog"
import ButtonGroup from "@mui/material/ButtonGroup"
import Button from "@mui/material/Button"
import MenuIcon from "@mui/icons-material/Menu"
import Menu from "@mui/material/Menu"
import Box from "@mui/material/Box"
import { genericHTTPRequestHandler } from "../../config"
import EditComment from "../new/EditComment"

interface TopicPostElementProps {
   comment: Comment
   postId: string
   currUser: User | undefined
   useUserError: boolean
}

export default function PostPageComment({
   comment,
   postId,
   currUser,
   useUserError,
}: TopicPostElementProps) {
   const [menuState, setMenuState] = useState<null | HTMLElement>(null)
   const isMenuOpen = Boolean(menuState)
   const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) =>
      setMenuState(event.currentTarget)
   const handleMenuClose = () => setMenuState(null)

   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
   const handleOpenDeleteDialog = () => setDeleteDialogOpen(true)
   const handleCloseDeleteDialog = () => setDeleteDialogOpen(false)

   const [editDialogOpen, setEditDialogOpen] = useState(false)
   const handleOpenEditDialog = () => setEditDialogOpen(true)
   const handleCloseEditDialog = () => setEditDialogOpen(false)

   const qc = useQueryClient()

   return (
      <li className="my-3">
         <Card>
            <CardContent className="relative">
               {comment.commentedBy.id === currUser?.id && (
                  <div
                     onClick={(e) => e.stopPropagation()}
                     className="absolute top-3 right-3"
                  >
                     <IconButton onClick={handleMenuOpen} size="small">
                        <MenuIcon />
                     </IconButton>
                     <Menu
                        anchorEl={menuState}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                     >
                        <MenuItem onClick={handleOpenEditDialog}>Edit</MenuItem>
                        <MenuItem onClick={handleOpenDeleteDialog}>
                           Delete
                        </MenuItem>
                     </Menu>
                     <Dialog
                        open={editDialogOpen}
                        onClose={handleCloseEditDialog}
                     >
                        <Box p={2} sx={{ minWidth: 500 }}>
                           <Typography>Edit Comment</Typography>
                           <EditComment
                              postId={postId}
                              comment={comment}
                              cb={() => {
                                 handleCloseEditDialog()
                                 handleMenuClose()
                              }}
                           />
                           <Button
                              onClick={handleCloseEditDialog}
                              className="w-full"
                           >
                              Cancel
                           </Button>
                        </Box>
                     </Dialog>
                     <Dialog
                        open={deleteDialogOpen}
                        onClose={handleCloseDeleteDialog}
                     >
                        <Box p={2}>
                           <Typography>
                              Do you really want to delete this comment?{" "}
                              <strong>This action cannot be undone.</strong>
                           </Typography>
                           <ButtonGroup>
                              <Button onClick={handleCloseDeleteDialog}>
                                 Cancel
                              </Button>
                              <Button
                                 color="error"
                                 onClick={async () => {
                                    await genericHTTPRequestHandler(
                                       "/comments",
                                       "delete",
                                       { commentId: comment.id },
                                       ["comments", postId!],
                                       qc,
                                       "Comment deletion"
                                    )
                                    handleCloseDeleteDialog()
                                 }}
                              >
                                 Delete
                              </Button>
                           </ButtonGroup>
                        </Box>
                     </Dialog>
                  </div>
               )}
               <Typography variant="h6">
                  #{comment.id} | {comment.content}
               </Typography>
               <Typography variant="caption" color="textSecondary">
                  <strong>{comment.commentedBy.username}</strong> |{" "}
                  {formatDate(comment.commentedOn)}
               </Typography>
               <GenericVoteDisplay
                  thing={comment}
                  isUserAuthenticated={!useUserError}
                  postId={postId}
                  forWhat="comment"
               />
            </CardContent>
         </Card>
      </li>
   )
}
