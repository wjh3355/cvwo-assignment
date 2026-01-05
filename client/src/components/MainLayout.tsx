import { Outlet } from "react-router";

export default function MainLayout() {
   return (
      <main className="min-h-screen flex flex-col">
         <section id="main-content" className="grow p-4 md:p-8 flex items-start">
            <Outlet />
         </section>

         <footer className="p-4 border-t text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TalkSpace
         </footer>
      </main>
   );
};