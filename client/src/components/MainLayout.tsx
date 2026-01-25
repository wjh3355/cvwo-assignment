import { Outlet } from "react-router"

export default function MainLayout() {
   return (
      <main className="min-h-[calc(100vh-48px)] flex flex-col">
         <section id="main-content" className="flex-1 p-4 md:p-8 flex">
            <Outlet />
         </section>

         <footer className="p-4 border-t text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TalkSpace
         </footer>
      </main>
   )
}
