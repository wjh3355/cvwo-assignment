import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import GenericLoading from "./components/GenericLoading";

const NotFound = lazy(() => import("./components/NotFound"));
const ErrorPage = lazy(() => import("./components/ErrorPage"));
const Home = lazy(() => import("./components/Home"));

const queryClient = new QueryClient();

export default function App() {

   return (
      <QueryClientProvider client={queryClient}>
         <BrowserRouter>
            <Toaster/>
            <ErrorBoundary fallback={<ErrorPage />}>
               <Suspense fallback={<GenericLoading/>}>
                  <Routes>

                     <Route index element={<Home/>}/>

                     <Route path="/auth">
                        <Route index element={<div>Login Page</div>}/>
                     </Route>

                     <Route path="*" element={<NotFound />} />

                  </Routes>
               </Suspense>
            </ErrorBoundary>
         </BrowserRouter>
      </QueryClientProvider>
   )
}
