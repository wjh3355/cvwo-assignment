export default function GenericLoading({ str }: { str?: string }) {
   return (
      <div>
         <span className="loading loading-spinner loading-xl"/>
         <div className="text-xl">{str || "Loading..."}</div>
      </div>
   )
}
