import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import { ErrorBoundary } from "react-error-boundary"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"

import GenericLoading from "./components/GenericLoading"
import AuthRoutesWrapper from "./components/auth/AuthWrapper"
import Navbar from "./components/Navbar"

const NotFound = lazy(() => import("./components/NotFound"))
const ErrorPage = lazy(() => import("./components/ErrorPage"))
const Home = lazy(() => import("./components/Home"))
const TopicPage = lazy(() => import("./components/topic/TopicPage"))
const PostPage = lazy(() => import("./components/post/PostPage"))
const Login = lazy(() => import("./components/auth/LoginPage"))
const MainLayout = lazy(() => import("./components/MainLayout"))
const Register = lazy(() => import("./components/auth/RegisterPage"))

const queryClient = new QueryClient()

export default function App() {
   return (
      <QueryClientProvider client={queryClient}>
         <BrowserRouter>
            <Toaster />
            <ErrorBoundary fallback={<ErrorPage />}>
               <Navbar />
               <Suspense fallback={<GenericLoading />}>
                  <Routes>
                     <Route element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path=":topic" element={<TopicPage />} />
                        <Route path=":topic/:postId" element={<PostPage />} />
                        <Route path="auth" element={<AuthRoutesWrapper />}>
                           <Route index element={<Login />} />
                           <Route path="register" element={<Register />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                     </Route>
                  </Routes>
               </Suspense>
            </ErrorBoundary>
         </BrowserRouter>
      </QueryClientProvider>
   )
}
