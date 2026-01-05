import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import useUser from '../hooks/useUser';
import { logoutHandler } from './auth/handlers';
import { useQueryClient } from '@tanstack/react-query';

export default function Navbar() {

   const nav = useNavigate();

   const { data: user, isLoading } = useUser();

   const qc = useQueryClient()

   return (
      <Box sx={{ flexGrow: 1 }}>
         <AppBar position="static">
            <Toolbar variant="dense">
               {/* <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
               >
                  <MenuIcon />
               </IconButton> */}
               <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1 }}
                  className='cursor-pointer'
                  onClick={() => nav('/')}
               >
                  TalkSpace
               </Typography>
               {user && !isLoading ? (
                  <>
                     <Typography
                        variant="body1"
                        component="div"
                        sx={{ marginRight: 2 }}
                     >
                        Welcome, {user.username}
                     </Typography>
                     <Button
                        color="inherit"
                        onClick={() => logoutHandler(qc, nav)}
                     >
                        Logout
                     </Button>
                  </>
               ) : (
                  <Button
                     color="inherit"
                     onClick={() => nav('/auth')}
                  >
                     Login
                  </Button>
               )}
            </Toolbar>
         </AppBar>
      </Box>
   );
}
