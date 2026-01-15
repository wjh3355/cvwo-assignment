import CircularProgress from "@mui/material/CircularProgress"

export default function GenericLoading({ str }: { str?: string }) {
   return (
      <div className="min-h-screen flex flex-col">
         <div className="grow p-4 md:p-8 flex items-start">
            <CircularProgress />
            <div className="text-xl">{str || "Loading..."}</div>
         </div>
      </div>
   )
}
