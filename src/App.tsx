
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Auth Pages
import Login from "@/pages/Login";

// Dashboard Pages
import Dashboard from "@/pages/dashboard/Dashboard";
import FlightsPage from "@/pages/dashboard/FlightsPage";
import AccommodationsPage from "@/pages/dashboard/AccommodationsPage";
import PackagesPage from "@/pages/dashboard/PackagesPage";
import VehiclesPage from "@/pages/dashboard/VehiclesPage";
import ShuttlesPage from "@/pages/dashboard/ShuttlesPage";
import FacilitationsPage from "@/pages/dashboard/FacilitationsPage";
import ActivitiesPage from "@/pages/dashboard/ActivitiesPage";
import BookingsPage from "@/pages/dashboard/BookingsPage";
import LeadsPage from "@/pages/dashboard/LeadsPage";
import PartnersPage from "@/pages/dashboard/PartnersPage";
import ResourcesPage from "@/pages/dashboard/ResourcesPage";
import GuidesPage from "@/pages/dashboard/GuidesPage";
import ToolkitsPage from "@/pages/dashboard/ToolKitsPage";
import GamesPage from "./pages/dashboard/GamesPage";
import ChecklistsPage from "./pages/dashboard/ChecklistsPage";
import MapAndDirectionsPage from "./pages/dashboard/MapAndDirectionsPage";
import StoriesPage from "./pages/dashboard/StoriesPage";
import DestinationsPage from "./pages/dashboard/DestinationsPage";
import GiftsPage from "./pages/dashboard/GiftsPage";
import CulturalEventPage from "./pages/dashboard/CulturalEventPage";
import TeamsPage from "./pages/dashboard/TeamsPage";
import JobsPage from "./pages/dashboard/JobsPage";
import CaseStudyPage from "./pages/dashboard/CaseStudyPages";
import FeedbackPage from "./pages/dashboard/FeedbackPage";
import FinancesPage from "./pages/dashboard/FinancesPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="flights" element={<FlightsPage />} />
              <Route path="accommodations" element={<AccommodationsPage />} />
              <Route path="packages" element={<PackagesPage />} />
              <Route path="vehicles" element={<VehiclesPage />} />
              <Route path="shuttles" element={<ShuttlesPage />} />
              <Route path="facilitations" element={<FacilitationsPage />} />
              <Route path="activities" element={<ActivitiesPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="trustedby" element={<PartnersPage />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="guides" element={<GuidesPage />} />
              <Route path="toolkits" element={<ToolkitsPage />} />
              <Route path="games" element={<GamesPage />} />
              <Route path="checklists" element={<ChecklistsPage />} />
              <Route path="maps" element={<MapAndDirectionsPage />} />
              <Route path="destinations" element={<DestinationsPage />} />
              <Route path="stories" element={<StoriesPage />} />
              <Route path="gifts" element={<GiftsPage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="cultural-events" element={<CulturalEventPage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="feedback" element={<FeedbackPage />} />
              
              {/* Additional dashboard pages */}
              <Route path="case-studies" element={<CaseStudyPage />} />
              <Route path="finances" element={<FinancesPage/>}/>
              
              {/* Additional protected routes */}
              {/* Catch-all for protected routes */}
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
