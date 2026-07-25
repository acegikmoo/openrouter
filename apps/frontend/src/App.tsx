import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ElysiaClientProvider } from "@/providers/Eden";
import { AuthGuard } from "@/components/AuthGuard";
import { Landing } from "./pages/Landing";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { Credits } from "./pages/Credits";
import { ApiKeys } from "./pages/ApiKeys";
import { NotFound } from "./pages/NotFound";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ElysiaClientProvider>
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<Landing />} />
            <Route path={"/signup"} element={<Signup />} />
            <Route path={"/signin"} element={<Signin />} />
            <Route path={"/dashboard"} element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path={"/credits"} element={<AuthGuard><Credits /></AuthGuard>} />
            <Route path={"/api-keys"} element={<AuthGuard><ApiKeys /></AuthGuard>} />
            <Route path={"*"} element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ElysiaClientProvider>
    </QueryClientProvider>
  )
}
export default App;
