import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { type NavigateFunction } from "react-router"
import { formatDate } from "../../utils"
import GenericVoteDisplay from "../voting/GenericVoteDisplay"
import type { Post, User } from "../../types"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import { useState, type MouseEvent } from "react"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Dialog from "@mui/material/Dialog"
import ButtonGroup from "@mui/material/ButtonGroup"
import Button from "@mui/material/Button"
import { useQueryClient } from "@tanstack/react-query"
import { genericHTTPRequestHandler } from "../../config"
import EditPost from "../new/EditPost"

interface TopicPostElementProps {
   post: Post
   topic: string
   nav: NavigateFunction
   currUser: User | undefined
   useUserError: boolean
}

export default function TopicPostElement({
   post,
   topic,
   nav,
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
      <li
         className="hover:cursor-pointer my-3"
         onClick={() => nav(`/${topic}/${post.id}`)}
      >
         <Card>
            <CardContent className="relative">
               {post.postedBy.id === currUser?.id && (
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
                        <Box p={2} sx={{ minWidth: 600 }}>
                           <Typography>Edit Post</Typography>
                           <EditPost
                              post={post}
                              topic={topic}
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
                              Do you really want to delete this post?{" "}
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
                                       "/posts",
                                       "delete",
                                       { postId: post.id },
                                       ["posts", topic],
                                       qc,
                                       "Post deletion"
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
               <Box>
                  <Typography variant="caption" color="textSecondary">
                     #{post.id} | Posted by{" "}
                     <strong>{post.postedBy.username}</strong> |{" "}
                     {formatDate(post.postedOn)} | {post.commentCount} comments
                  </Typography>
               </Box>
               <Typography variant="h5">{post.title}</Typography>
               <Typography variant="body2" color="textSecondary" noWrap>
                  {post.description}
               </Typography>
               <div onClick={(e) => e.stopPropagation()}>
                  <GenericVoteDisplay
                     thing={post}
                     isUserAuthenticated={!useUserError}
                     topic={topic}
                     forWhat="post"
                     isADeletedPost={post.postedBy.id === -999}
                  />
               </div>
            </CardContent>
         </Card>
      </li>
   )
}
