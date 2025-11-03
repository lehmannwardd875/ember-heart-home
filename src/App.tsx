import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { VerificationGuard } from "./components/VerificationGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Verification from "./pages/Verification";
import ProfileBuilder from "./pages/ProfileBuilder";
import ProfilePublished from "./pages/ProfilePublished";
import MyProfile from "./pages/MyProfile";
import Settings from "./pages/Settings";
import ReflectionMode from "./pages/ReflectionMode";
import DailyMatches from "./pages/DailyMatches";
import Admin from "./pages/Admin";
import PrivateChat from "./pages/PrivateChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
          <Route path="/verify" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
          <Route path="/profile/create" element={<ProtectedRoute><VerificationGuard><ProfileBuilder /></VerificationGuard></ProtectedRoute>} />
          <Route path="/profile/published" element={<ProtectedRoute><ProfilePublished /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/reflection" element={<ProtectedRoute><ReflectionMode /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><DailyMatches /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminRoute><Admin /></AdminRoute></ProtectedRoute>} />
          <Route path="/chat/:matchId" element={<ProtectedRoute><PrivateChat /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
