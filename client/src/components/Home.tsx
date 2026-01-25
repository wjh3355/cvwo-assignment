import { useNavigate } from "react-router"
import { capitalise } from "../utils"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { useFetch } from "../hooks/useFetch"
import GenericLoading from "./GenericLoading"
import MakeNewTopic from "./new/MakeNewTopic"
import useUser from "../hooks/useUser"

export default function Home() {
   const nav = useNavigate()

   const { data: topics } = useFetch<string[]>(["topics"], `/topics`)

   const { data: user } = useUser()

   return (
      <Container maxWidth="md">
         <Stack spacing={4} alignItems="center" sx={{ mt: 4 }}>
            <Typography variant="h5" component="h1" align="center" gutterBottom>
               Welcome to TalkSpace
            </Typography>

            <Paper
               elevation={3}
               sx={{ paddingTop: 2, paddingBottom: 2, textAlign: "center" }}
            >
               <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap={1}
                  justifyContent="center"
               >
                  {!topics ? (
                     <GenericLoading />
                  ) : (
                     topics.map((topic) => (
                        <Button
                           key={topic}
                           onClick={() => nav(`/${topic}`)}
                           variant="contained"
                           size="large"
                           sx={{
                              minWidth: 140,
                              textTransform: "none",
                              borderRadius: 2,
                           }}
                        >
                           {capitalise(topic)}
                        </Button>
                     ))
                  )}
               </Stack>
            </Paper>

            <MakeNewTopic user={user} />
         </Stack>
      </Container>
   )
}
