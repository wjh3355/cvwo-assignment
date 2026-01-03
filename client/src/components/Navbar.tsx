import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';

export default function Navbar() {

   const nav = useNavigate();

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
                  Forum123
               </Typography>
               <Button 
                  color="inherit"
                  onClick={() => nav('/auth')}
               >
                  Login
               </Button>
            </Toolbar>
         </AppBar>
      </Box>
   );
}
