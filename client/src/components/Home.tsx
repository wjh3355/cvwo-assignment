import { useNavigate } from "react-router"
import { TOPICS } from "../config";
import { capitalise } from "../utils";
import Button from "@mui/material/Button"
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export default function Home() {

   const nav = useNavigate();

   return (
      <Container maxWidth="md">
         <Stack spacing={4} alignItems="center" sx={{ mt: 4 }}>
            <Typography variant="h5" component="h1" align="center" gutterBottom>
               Welcome to TalkSpace
            </Typography>

            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>

               <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap={2}
                  justifyContent="center"
               >
                  {TOPICS.map((topic) => (
                     <Button
                        key={topic}
                        onClick={() => nav(`/${topic}`)}
                        variant="contained"
                        size="large"
                        sx={{
                           minWidth: 140,
                           textTransform: 'none',
                           borderRadius: 2
                        }}
                     >
                        {capitalise(topic)}
                     </Button>
                  ))}
               </Stack>

            </Paper>
         </Stack>
      </Container>
   )
}
